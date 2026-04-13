import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('your_')) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const supabase = createAdminClient()
    const body = await request.json()
    const { leadId, mode, amount, customerEmail } = body

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 })
    }

    const { data: paymentModeSetting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'payment_mode')
      .single()

    const paymentMode = mode || paymentModeSetting?.value || 'off'

    if (paymentMode === 'off') {
      return NextResponse.json({ error: 'Payments are disabled' }, { status: 400 })
    }

    const { data: lead } = await supabase
      .from('leads')
      .select('*, customers(*)')
      .eq('id', leadId)
      .single()

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const email = customerEmail || lead.customers?.email
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/book/success?id=${leadId}`

    let session

    if (paymentMode === 'deposit') {
      const depositAmount =
        amount ||
        (await supabase
          .from('settings')
          .select('value')
          .eq('key', 'deposit_amount')
          .single()
          .then((r) => r?.data?.value)) ||
        50

      session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        return_url: returnUrl,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'cad',
              product_data: {
                name: 'TrashThat Deposit',
                description: `Booking deposit for junk removal at ${lead.address}`,
              },
              unit_amount: Math.round(depositAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: email,
        metadata: { leadId, mode: 'deposit' },
      })
    } else if (paymentMode === 'save_card') {
      session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        return_url: returnUrl,
        mode: 'setup',
        customer_email: email,
        metadata: { leadId, mode: 'save_card' },
      })
    }

    if (!session) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    await supabase.from('payments').insert({
      lead_id: leadId,
      stripe_session_id: session.id,
      mode: paymentMode,
      status: 'pending',
    })

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.error('Stripe session error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session: ' + error.message },
      { status: 500 }
    )
  }
}
