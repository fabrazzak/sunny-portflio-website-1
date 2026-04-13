import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin')

  const adminSupabase = createAdminClient()
  const { data: adminUser } = await adminSupabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminUser) redirect('/admin')

  const { data: settings } = await adminSupabase.from('settings').select('key, value')

  const settingsMap = {}
  if (settings) {
    settings.forEach((s) => { settingsMap[s.key] = s.value })
  }

  return <SettingsForm initialSettings={settingsMap} />
}
