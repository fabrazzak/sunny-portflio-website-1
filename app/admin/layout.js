import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminNav from './AdminNav'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const adminSupabase = createAdminClient()
  const { data: adminUser } = user
    ? await adminSupabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single()
    : { data: null }

  if (!user || !adminUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2">
                  <img src="/logo.png" alt="TrashThat" className="h-10 w-auto" />
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">{children}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="TrashThat" className="h-10 w-auto" />
              </Link>
              <AdminNav />
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-800 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                View Site
              </Link>
              <form action="/admin/logout" method="post">
                <button
                  type="submit"
                  className="text-white bg-red-500 hover:bg-red-600 text-sm font-semibold px-3 py-2 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}