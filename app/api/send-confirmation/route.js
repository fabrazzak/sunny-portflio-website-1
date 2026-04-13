import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('your_')) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const supabase = createAdminClient()

    const [officeEmailRow, fromEmailRow] = await Promise.all([
      supabase.from('settings').select('value').eq('key', 'office_email').single(),
      supabase.from('settings').select('value').eq('key', 'from_email').single(),
    ])

    const officeEmail =
      officeEmailRow.data?.value || 'office@trashthat.ca'
    const fromEmail =
      fromEmailRow.data?.value || 'TrashThat <noreply@trashthat.ca>'

    const body = await request.json()
    const {
      leadId,
      customerName,
      customerEmail,
      address,
      whatNeedsRemoval,
      preferredDate,
      preferredTimeWindow,
    } = body

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 })
    }

    const { data: lead } = await supabase
      .from('leads')
      .select('*, lead_photos(*), customers(first_name, last_name, phone)')
      .eq('id', leadId)
      .single()

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const fullName = lead.customers
      ? `${lead.customers.first_name} ${lead.customers.last_name}`
      : customerName || 'Customer'
    const phone = lead.customers?.phone || 'Not provided'
    const firstName = fullName.split(' ')[0]

    const officeBody = `
New Junk Removal Request

Customer: ${fullName}
Email: ${customerEmail}
Phone: ${phone}

Service Address:
${lead.address}${lead.unit ? ', ' + lead.unit : ''}
${lead.postal_code}
${lead.buzzer_note ? `Access: ${lead.buzzer_note}` : ''}

What needs to be removed:
${lead.what_needs_removal}

${lead.item_categories?.length ? `Categories: ${lead.item_categories.join(', ')}` : ''}
${lead.job_type ? `Job size: ${lead.job_type}` : ''}
${lead.special_items?.length ? `Special items: ${lead.special_items.join(', ')}` : ''}
${lead.junk_notes ? `Notes: ${lead.junk_notes}` : ''}

Access conditions:
${[lead.has_stairs && 'Stairs', lead.has_elevator && 'Elevator', lead.long_carry && 'Long carry'].filter(Boolean).join(', ') || 'Standard'}
${lead.parking_notes ? `Parking: ${lead.parking_notes}` : ''}

Preferred timing:
Date: ${lead.preferred_date}
Time window: ${lead.preferred_time_window}

Photos: ${lead.lead_photos?.length || 0} uploaded

Submitted: ${new Date(lead.created_at).toLocaleString()}
    `.trim()

    const customerBody = `
Hi ${firstName},

Thanks for choosing TrashThat! We've received your junk removal request and will be in touch within 24 hours with your quote.

Here's a summary of what you submitted:
- Address: ${lead.address}, ${lead.postal_code}
- What needs to be removed: ${lead.what_needs_removal}
- Preferred date: ${lead.preferred_date} (${lead.preferred_time_window})

We'll email you as soon as we've reviewed your photos and can confirm the details.

Questions? Just reply to this email.

The TrashThat Team
    `.trim()

    await Promise.allSettled([
      resend.emails.send({
        from: fromEmail,
        to: [officeEmail],
        subject: `New Lead: ${fullName} – ${address}`,
        text: officeBody,
      }),
      resend.emails.send({
        from: fromEmail,
        to: [customerEmail],
        subject: `Your TrashThat request – ${new Date().toLocaleDateString()}`,
        text: customerBody,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Confirmation email error:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation' },
      { status: 500 }
    )
  }
}
