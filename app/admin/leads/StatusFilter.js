'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function StatusFilter({ current, statuses }) {
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(e) {
    const value = e.target.value
    if (value) {
      router.push(`${pathname}?status=${value}`)
    } else {
      router.push(pathname)
    }
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
    >
      <option value="">All statuses</option>
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
        </option>
      ))}
    </select>
  )
}
