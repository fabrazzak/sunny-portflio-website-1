import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import StatusFilter from './StatusFilter'

const STATUS_COLORS = {
  new:              'bg-blue-100 text-blue-800',
  reviewing:        'bg-yellow-100 text-yellow-800',
  quoted:           'bg-purple-100 text-purple-800',
  awaiting_payment: 'bg-orange-100 text-orange-800',
  confirmed:        'bg-green-100 text-green-800',
  completed:        'bg-gray-100 text-gray-800',
  cancelled:        'bg-red-100 text-red-800',
}

const STATUSES = ['new', 'reviewing', 'quoted', 'awaiting_payment', 'confirmed', 'completed', 'cancelled']

export default async function LeadsPage({ searchParams }) {
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

  const { status: statusFilter } = await searchParams

  let query = adminSupabase
    .from('leads')
    .select('*, customers(first_name, last_name, email, phone)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (statusFilter && STATUSES.includes(statusFilter)) {
    query = query.eq('status', statusFilter)
  }

  const { data: leads, error } = await query

  if (error) console.error('Leads fetch error:', error)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Leads
          {statusFilter && (
            <span className="ml-2 text-base font-normal text-gray-500">
              — {statusFilter.replace('_', ' ')}
            </span>
          )}
        </h1>
        <StatusFilter current={statusFilter || ''} statuses={STATUSES} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">What</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!leads || leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {statusFilter
                      ? `No leads with status "${statusFilter.replace('_', ' ')}".`
                      : 'No leads yet. Share your booking form to get started!'}
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[lead.status] || 'bg-gray-100'}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.customers?.first_name} {lead.customers?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{lead.customers?.email}</div>
                      <div className="text-sm text-gray-500">{lead.customers?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {lead.address}{lead.unit && `, ${lead.unit}`}
                      </div>
                      <div className="text-sm text-gray-500">{lead.postal_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {lead.what_needs_removal}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.preferred_date}</div>
                      <div className="text-sm text-gray-500">{lead.preferred_time_window}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/leads/${lead.id}`} className="text-green-600 hover:text-green-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
