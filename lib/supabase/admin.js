import { createClient } from '@supabase/supabase-js'

// Server-only: uses service role key, bypasses RLS.
// Never expose this client or key to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
