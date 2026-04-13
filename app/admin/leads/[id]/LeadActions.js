'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  'new', 'reviewing', 'quoted', 'awaiting_payment', 'confirmed', 'completed', 'cancelled',
]

// ── Status updater ────────────────────────────────────────────────────────────

function StatusPanel({ leadId, currentStatus }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null) // { type: 'ok'|'err', text }

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg({ type: 'err', text: data.error || 'Save failed' })
      } else {
        setMsg({ type: 'ok', text: 'Status updated' })
        router.refresh()
      }
    } catch {
      setMsg({ type: 'err', text: 'Network error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
          </option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={saving || status === currentStatus}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-40"
      >
        {saving ? 'Saving…' : 'Update Status'}
      </button>
      {msg && (
        <p className={`mt-2 text-xs text-center ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
          {msg.text}
        </p>
      )}
    </div>
  )
}

// ── Notes ─────────────────────────────────────────────────────────────────────

function NotesPanel({ leadId, currentNotes }) {
  const [notes, setNotes] = useState(currentNotes)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg({ type: 'err', text: data.error || 'Save failed' })
      } else {
        setMsg({ type: 'ok', text: 'Notes saved ✓' })
      }
    } catch {
      setMsg({ type: 'err', text: 'Network error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 resize-none"
        placeholder="Add notes for this lead…"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-40"
      >
        {saving ? 'Saving…' : 'Save Notes'}
      </button>
      {msg && (
        <p className={`mt-2 text-xs text-center ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
          {msg.text}
        </p>
      )}
    </div>
  )
}

// ── Quote email via EmailJS ───────────────────────────────────────────────────

function QuoteEmailPanel({ customerName, customerEmail, address, postalCode, whatNeedsRemoval, preferredDate, preferredTimeWindow }) {
  const [open, setOpen] = useState(false)
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNote, setQuoteNote] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState(null)

  const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  const configured = serviceId && templateId && publicKey

  async function handleSend() {
    if (!configured) {
      setMsg({ type: 'err', text: 'EmailJS env vars not set. Check .env.local for NEXT_PUBLIC_EMAILJS_SERVICE_ID, _TEMPLATE_ID, _PUBLIC_KEY.' })
      return
    }
    if (!quoteAmount) {
      setMsg({ type: 'err', text: 'Please enter a quote amount.' })
      return
    }
    if (!customerEmail) {
      setMsg({ type: 'err', text: 'No email address on file for this customer.' })
      return
    }

    setSending(true)
    setMsg(null)

    try {
      const emailjs = (await import('@emailjs/browser')).default

      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          to_name:         customerName || 'Customer',
          to_email:        customerEmail,
          quote_amount:    quoteAmount,
          address:         `${address}${postalCode ? ', ' + postalCode : ''}`,
          description:     whatNeedsRemoval || 'N/A',
          preferred_date:  preferredDate || 'TBD',
          preferred_time:  preferredTimeWindow || 'TBD',
          note:            quoteNote,
        },
        { publicKey },   // v4 requires an options object, not a bare string
      )

      console.log('EmailJS result:', result)
      setMsg({ type: 'ok', text: `Quote sent to ${customerEmail} ✓` })
      setQuoteAmount('')
      setQuoteNote('')
      setOpen(false)
    } catch (err) {
      console.error('EmailJS error:', err)
      // EmailJS errors have { status, text } shape
      const detail = err?.text || err?.message || JSON.stringify(err)
      setMsg({ type: 'err', text: `Send failed (${err?.status ?? '?'}): ${detail}` })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Quote</h2>

      {!open ? (
        <button
          onClick={() => { setOpen(true); setMsg(null) }}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Send Quote Email
        </button>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
            <div className="text-sm text-gray-800 bg-gray-50 rounded px-3 py-2 border border-gray-200">
              {customerName} &lt;{customerEmail}&gt;
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Quote Amount (e.g. $250)
            </label>
            <input
              type="text"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              placeholder="$250"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Additional Message (optional)
            </label>
            <textarea
              value={quoteNote}
              onChange={(e) => setQuoteNote(e.target.value)}
              rows={3}
              placeholder="Any extra details for the customer…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-40"
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {msg && (
        <p className={`mt-3 text-xs ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
          {msg.text}
        </p>
      )}
    </div>
  )
}

// ── Composed actions panel ────────────────────────────────────────────────────

export default function LeadActions({
  leadId, currentStatus, currentNotes,
  customerName, customerEmail,
  address, postalCode,
  whatNeedsRemoval, preferredDate, preferredTimeWindow,
}) {
  return (
    <div className="space-y-6">
      <StatusPanel leadId={leadId} currentStatus={currentStatus} />
      <NotesPanel  leadId={leadId} currentNotes={currentNotes} />
      <QuoteEmailPanel
        customerName={customerName}
        customerEmail={customerEmail}
        address={address}
        postalCode={postalCode}
        whatNeedsRemoval={whatNeedsRemoval}
        preferredDate={preferredDate}
        preferredTimeWindow={preferredTimeWindow}
      />
    </div>
  )
}
