import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata = {
  title: 'TrashThat – Junk Removal Made Easy',
  description:
    'Book a junk removal pickup in minutes. TrashThat hauls away furniture, appliances, renovation debris, and more. Serving your area with fast, reliable service.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
