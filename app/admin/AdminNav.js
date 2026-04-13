'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/settings', label: 'Settings' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="hidden sm:flex items-center gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-1 rounded mr-3">
        Admin
      </span>
      {links.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
              active
                ? 'text-green-700 bg-green-100'
                : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
