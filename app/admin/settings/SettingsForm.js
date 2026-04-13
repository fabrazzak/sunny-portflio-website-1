'use client'

import Link from 'next/link'
import { useState } from 'react'

const SETTINGS_CONFIG = [
  // ── Payment & mode toggles
  { key: 'payment_mode',           label: 'Payment Mode',                         type: 'select',  options: ['off', 'deposit', 'save_card'], group: 'Payment' },
  { key: 'ai_mode',                label: 'AI Quote Assistance',                  type: 'boolean',                                           group: 'Payment' },
  // ── Base pricing
  { key: 'minimum_charge',         label: 'Minimum Charge ($)',                   type: 'number',                                            group: 'Pricing' },
  { key: 'deposit_amount',         label: 'Deposit Amount ($)',                   type: 'number',                                            group: 'Pricing' },
  // ── Load pricing tiers
  { key: 'load_quarter_price',     label: 'Quarter Load Price ($)',               type: 'number',                                            group: 'Load Pricing' },
  { key: 'load_half_price',        label: 'Half Load Price ($)',                  type: 'number',                                            group: 'Load Pricing' },
  { key: 'load_three_quarter_price', label: 'Three-Quarter Load Price ($)',       type: 'number',                                            group: 'Load Pricing' },
  { key: 'load_full_price',        label: 'Full Load Price ($)',                  type: 'number',                                            group: 'Load Pricing' },
  // ── Add-on fees
  { key: 'stairs_fee',             label: 'Stairs Fee ($)',                       type: 'number',                                            group: 'Add-on Fees' },
  { key: 'heavy_item_fee',         label: 'Heavy Item Fee ($)',                   type: 'number',                                            group: 'Add-on Fees' },
  { key: 'rush_fee',               label: 'Rush Fee ($)',                         type: 'number',                                            group: 'Add-on Fees' },
  // ── Service rules
  { key: 'photo_min',              label: 'Minimum Photos Required',              type: 'number',                                            group: 'Rules' },
  { key: 'photo_max',              label: 'Maximum Photos Allowed',               type: 'number',                                            group: 'Rules' },
  { key: 'service_zones',          label: 'Service Zones (comma-separated)',      type: 'text',                                              group: 'Rules' },
  { key: 'blocked_items',          label: 'Blocked Items (comma-separated)',      type: 'text',                                              group: 'Rules' },
  { key: 'manual_review_rules',    label: 'Manual Review Rules',                  type: 'textarea',                                          group: 'Rules' },
  // ── Email
  { key: 'office_email',           label: 'Office Email',                         type: 'email',                                             group: 'Email' },
  { key: 'from_email',             label: 'From / Sender Email',                  type: 'email',                                             group: 'Email' },
]

function parseRawValue(rawValue, type) {
  if (type === 'boolean') return rawValue === 'true'
  if (type === 'number') {
    if (rawValue === '' || rawValue === null || rawValue === undefined) return null
    const n = Number(rawValue)
    return isNaN(n) ? null : n
  }
  if (type === 'select') return rawValue
  // text / email
  return rawValue === '' ? null : rawValue
}

function displayValue(value, type) {
  if (value === null || value === undefined) return ''
  if (type === 'boolean') return value === true ? 'true' : 'false'
  if (type === 'select') return typeof value === 'string' ? value : JSON.stringify(value)
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

function SettingField({ setting, initialValue, onSave }) {
  const [inputValue, setInputValue] = useState(() => displayValue(initialValue, setting.type))
  const [status, setStatus] = useState(null) // null | 'saving' | 'saved' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSave(e) {
    e.preventDefault()
    setStatus('saving')
    setErrorMsg('')

    const parsed = parseRawValue(inputValue, setting.type)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: setting.key, value: parsed }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Save failed')
      } else {
        setStatus('saved')
        setTimeout(() => setStatus(null), 2000)
        if (onSave) onSave(setting.key, parsed)
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg('Network error')
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <form onSubmit={handleSave}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {setting.label}
        </label>

        {setting.type === 'select' ? (
          <select
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {setting.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        ) : setting.type === 'boolean' ? (
          <select
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="false">Disabled</option>
            <option value="true">Enabled</option>
          </select>
        ) : setting.type === 'textarea' ? (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
            placeholder="Leave empty to clear"
          />
        ) : (
          <input
            type={setting.type === 'number' ? 'number' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Leave empty to clear"
          />
        )}

        <div className="flex items-center justify-between mt-2">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="text-xs font-medium px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {status === 'saving' ? 'Saving…' : 'Save'}
          </button>

          {status === 'saved' && (
            <span className="text-xs text-green-600 font-medium">Saved ✓</span>
          )}
          {status === 'error' && (
            <span className="text-xs text-red-600">{errorMsg}</span>
          )}
        </div>
      </form>
    </div>
  )
}

// Group the config by the `group` property
const GROUPS = [...new Set(SETTINGS_CONFIG.map((s) => s.group))]

export default function SettingsForm({ initialSettings }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/leads" className="text-gray-500 hover:text-gray-700 text-sm">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Changes take effect immediately. Each field saves independently.
      </p>

      {GROUPS.map((group) => {
        const fields = SETTINGS_CONFIG.filter((s) => s.group === group)
        return (
          <div key={group} className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {group}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((setting) => (
                <SettingField
                  key={setting.key}
                  setting={setting}
                  initialValue={initialSettings[setting.key]}
                />
              ))}
            </div>
          </div>
        )
      })}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">Tips</h3>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• <strong>Payment Mode</strong>: Keep &quot;off&quot; until Stripe is fully configured.</li>
          <li>• <strong>Load Pricing</strong>: Set prices per truck-load tier (quarter → full). Leave empty to skip that tier.</li>
          <li>• <strong>Service Zones</strong>: Comma-separated postal prefixes, e.g. M1L, M1K, M1N.</li>
          <li>• <strong>Manual Review Rules</strong>: Notes for your team on when to manually review a lead before quoting.</li>
          <li>• <strong>AI Mode</strong>: Keep disabled until pricing rules are ready.</li>
        </ul>
      </div>
    </div>
  )
}
