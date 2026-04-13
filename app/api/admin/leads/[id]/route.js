import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const VALID_STATUSES = [
  'new', 'reviewing', 'quoted', 'awaiting_payment', 'confirmed', 'completed', 'cancelled',
]

async function getAuthenticatedAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminSupabase = createAdminClient()
  const { data: adminUser } = await adminSupabase
    .from('admin_users').select('id').eq('id', user.id).single()

  return adminUser ? adminSupabase : null
}

export async function PATCH(request, { params }) {
  const db = await getAuthenticatedAdmin()
  if (!db) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const update = {}

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    update.status = body.status
  }

  if (body.notes !== undefined) {
    update.internal_notes = body.notes
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const { error } = await db.from('leads').update(update).eq('id', id)

  if (error) {
    console.error('Lead update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
