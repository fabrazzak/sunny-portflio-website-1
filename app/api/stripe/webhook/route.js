import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const leadId = session.metadata?.leadId

      if (leadId) {
        if (session.mode === 'payment') {
          // Deposit paid — job is confirmed
          await supabase
            .from('payments')
            .update({
              stripe_payment_intent_id: session.payment_intent,
              status: 'paid',
            })
            .eq('stripe_session_id', session.id)

          await supabase
            .from('leads')
            .update({ status: 'confirmed' })
            .eq('id', leadId)
        } else if (session.mode === 'setup') {
          // Card saved — awaiting payment later
          await supabase
            .from('payments')
            .update({
              stripe_setup_intent_id: session.setup_intent,
              status: 'saved',
            })
            .eq('stripe_session_id', session.id)

          await supabase
            .from('leads')
            .update({ status: 'awaiting_payment' })
            .eq('id', leadId)
        }
      }
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object
      if (session.metadata?.leadId) {
        await supabase
          .from('payments')
          .update({ status: 'expired' })
          .eq('stripe_session_id', session.id)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object
      console.error('Payment failed:', paymentIntent.id)
      break
    }

    default:
      console.log('Unhandled event type:', event.type)
  }

  return NextResponse.json({ received: true })
}
