import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      unit,
      postalCode,
      buzzerNote,
      whatNeedsRemoval,
      itemCategories,
      jobType,
      specialItems,
      junkNotes,
      hasStairs,
      hasElevator,
      longCarry,
      parkingNotes,
      preferredDate,
      preferredTimeWindow,
      photos,
    } = body

    if (!email || !address || !whatNeedsRemoval) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    let customerId = existingCustomer?.id

    if (!customerId) {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          first_name: firstName,
          last_name: lastName,
          phone,
          email: email.toLowerCase(),
        })
        .select('id')
        .single()

      if (customerError) {
        console.error('Customer error:', customerError)
        return NextResponse.json(
          { error: 'Failed to create customer: ' + customerError.message },
          { status: 500 }
        )
      }

      customerId = newCustomer.id
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        customer_id: customerId,
        status: 'new',
        address,
        unit,
        postal_code: postalCode,
        buzzer_note: buzzerNote,
        what_needs_removal: whatNeedsRemoval,
        item_categories: itemCategories || [],
        job_type: jobType,
        special_items: specialItems || [],
        junk_notes: junkNotes,
        has_stairs: hasStairs || false,
        has_elevator: hasElevator || false,
        long_carry: longCarry || false,
        parking_notes: parkingNotes,
        preferred_date: preferredDate,
        preferred_time_window: preferredTimeWindow,
      })
      .select('id')
      .single()

    if (leadError) {
      console.error('Lead error:', leadError)
      return NextResponse.json(
        { error: 'Failed to create lead: ' + leadError.message },
        { status: 500 }
      )
    }

    if (photos && photos.length > 0) {
      const photoRecords = photos.map((p) => ({
        lead_id: lead.id,
        url: p.url,
        filename: p.filename,
      }))

      const { error: photosError } = await supabase
        .from('lead_photos')
        .insert(photoRecords)

      if (photosError) {
        console.error('Photos error:', photosError)
      }
    }

    // Save booking request record (requirement P)
    if (preferredDate || preferredTimeWindow) {
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          lead_id: lead.id,
          requested_date: preferredDate || null,
          requested_time_window: preferredTimeWindow || null,
        })

      if (bookingError) {
        console.error('Booking record error:', bookingError)
        // Non-blocking — lead is already saved
      }
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          address,
          whatNeedsRemoval,
          preferredDate,
          preferredTimeWindow,
        }),
      })
    } catch (emailErr) {
      console.error('Email error (non-blocking):', emailErr)
    }

    const { data: paymentModeSetting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'payment_mode')
      .single()

    return NextResponse.json({
      leadId: lead.id,
      paymentMode: paymentModeSetting?.value || 'off',
    })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}