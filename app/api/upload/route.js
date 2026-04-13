import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const config = {
  api: { bodyParser: false },
}

// Raise Vercel's default 4.5 MB body limit to 20 MB for photo uploads
export const maxDuration = 30
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const supabase = createAdminClient()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase env vars on this deployment')
      return NextResponse.json({ error: 'Server misconfiguration: missing Supabase env vars' }, { status: 500 })
    }

    const { data, error } = await supabase.storage
      .from('lead-photos')
      .upload(filename, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      })

    if (error) {
      console.error('Supabase storage error:', JSON.stringify(error))
      return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('lead-photos')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 })
  }
}
