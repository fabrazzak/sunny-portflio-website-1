import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { leadId } = body

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 })
    }

    const { data: aiModeSetting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'ai_mode')
      .single()

    if (aiModeSetting?.value !== true) {
      return NextResponse.json(
        { error: 'AI quotes are not enabled' },
        { status: 400 }
      )
    }

    const { data: lead } = await supabase
      .from('leads')
      .select('*, lead_photos(*), customers(*)')
      .eq('id', leadId)
      .single()

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Placeholder — enable once pricing rules are configured in settings
    return NextResponse.json({
      error: 'AI quoting not yet configured. Populate pricing settings before enabling.',
      note: 'Placeholder endpoint. Set ai_mode = true in settings and add pricing data to activate.',
    }, { status: 503 })
  } catch (error) {
    console.error('AI quote error:', error)
    return NextResponse.json(
      { error: 'AI quote generation failed' },
      { status: 500 }
    )
  }
}
