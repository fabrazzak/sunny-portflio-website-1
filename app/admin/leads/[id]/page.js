import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import LeadActions from './LeadActions'

const STATUS_COLORS = {
  new:              'bg-blue-100 text-blue-800',
  reviewing:        'bg-yellow-100 text-yellow-800',
  quoted:           'bg-purple-100 text-purple-800',
  awaiting_payment: 'bg-orange-100 text-orange-800',
  confirmed:        'bg-green-100 text-green-800',
  completed:        'bg-gray-100 text-gray-800',
  cancelled:        'bg-red-100 text-red-800',
}

export default async function LeadDetailPage({ params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin')

  const adminSupabase = createAdminClient()
  const { data: adminUser } = await adminSupabase
    .from('admin_users').select('id').eq('id', user.id).single()
  if (!adminUser) redirect('/admin')

  const { id } = await params
  const { data: lead, error } = await adminSupabase
    .from('leads')
    .select('*, customers(*), lead_photos(*)')
    .eq('id', id)
    .single()

  if (error || !lead) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Lead not found</h1>
        <Link href="/admin/leads" className="text-green-600 hover:underline">Back to leads</Link>
      </div>
    )
  }

  const customer = lead.customers

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/leads" className="text-gray-500 hover:text-gray-700 text-sm">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[lead.status] || 'bg-gray-100'}`}>
          {lead.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: lead data ── */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="text-gray-900 font-medium">{customer?.first_name} {customer?.last_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-900">{customer?.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="text-gray-900">{customer?.phone}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Submitted</dt>
                <dd className="text-gray-900">{new Date(lead.created_at).toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Address</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500 inline">Address: </dt>
                <dd className="text-gray-900 inline">{lead.address}{lead.unit && `, ${lead.unit}`}</dd>
              </div>
              <div>
                <dt className="text-gray-500 inline">Postal Code: </dt>
                <dd className="text-gray-900 inline">{lead.postal_code}</dd>
              </div>
              {lead.buzzer_note && (
                <div>
                  <dt className="text-gray-500 inline">Access Note: </dt>
                  <dd className="text-gray-900 inline">{lead.buzzer_note}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Junk Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">What needs removal</dt>
                <dd className="text-gray-900">{lead.what_needs_removal}</dd>
              </div>
              {lead.item_categories?.length > 0 && (
                <div>
                  <dt className="text-gray-500">Categories</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {lead.item_categories.map((cat) => (
                      <span key={cat} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{cat}</span>
                    ))}
                  </dd>
                </div>
              )}
              {lead.job_type && (
                <div>
                  <dt className="text-gray-500">Job Size</dt>
                  <dd className="text-gray-900 capitalize">{lead.job_type}</dd>
                </div>
              )}
              {lead.special_items?.length > 0 && (
                <div>
                  <dt className="text-gray-500">Special Items</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {lead.special_items.map((item) => (
                      <span key={item} className="bg-orange-100 px-2 py-0.5 rounded text-xs">{item}</span>
                    ))}
                  </dd>
                </div>
              )}
              {lead.junk_notes && (
                <div>
                  <dt className="text-gray-500">Notes</dt>
                  <dd className="text-gray-900">{lead.junk_notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Access & Timing</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Access</dt>
                <dd className="text-gray-900">
                  {[lead.has_stairs && 'Stairs', lead.has_elevator && 'Elevator', lead.long_carry && 'Long carry']
                    .filter(Boolean).join(', ') || 'Standard'}
                </dd>
              </div>
              {lead.parking_notes && (
                <div>
                  <dt className="text-gray-500">Parking</dt>
                  <dd className="text-gray-900">{lead.parking_notes}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Preferred Date</dt>
                <dd className="text-gray-900">{lead.preferred_date}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Preferred Time</dt>
                <dd className="text-gray-900">{lead.preferred_time_window}</dd>
              </div>
            </dl>
          </div>

          {lead.lead_photos?.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Photos ({lead.lead_photos.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {lead.lead_photos.map((photo) => (
                  <a key={photo.id} href={photo.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={photo.url}
                      alt={photo.filename || 'Lead photo'}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-90"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: interactive actions ── */}
        <LeadActions
          leadId={id}
          currentStatus={lead.status}
          currentNotes={lead.internal_notes || ''}
          customerName={`${customer?.first_name ?? ''} ${customer?.last_name ?? ''}`.trim()}
          customerEmail={customer?.email ?? ''}
          address={lead.address}
          postalCode={lead.postal_code}
          whatNeedsRemoval={lead.what_needs_removal}
          preferredDate={lead.preferred_date}
          preferredTimeWindow={lead.preferred_time_window}
        />
      </div>
    </div>
  )
}
