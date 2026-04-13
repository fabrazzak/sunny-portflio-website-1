'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, Suspense } from 'react'

// ── Stripe embedded checkout ─────────────────────────────────────────────────

function EmbeddedCheckout({ leadId, onComplete }) {
  const containerRef = useRef(null)
  const checkoutRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function mount() {
      try {
        const res = await fetch('/api/stripe/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId }),
        })
        const data = await res.json()

        if (cancelled) return

        if (!res.ok || !data.clientSecret) {
          onComplete()
          return
        }

        const { loadStripe } = await import('@stripe/stripe-js')
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        if (!stripe || cancelled) return

        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret: data.clientSecret,
        })

        if (cancelled) {
          checkout.destroy()
          return
        }

        checkout.mount(containerRef.current)
        checkoutRef.current = checkout
        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          console.error('Checkout error:', err)
          setError('Unable to load payment. Your request was still received.')
          setLoading(false)
        }
      }
    }

    mount()
    return () => {
      cancelled = true
      checkoutRef.current?.destroy()
    }
  }, [leadId, onComplete])

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 text-center">
        {error}
        <button
          onClick={onComplete}
          className="block mt-3 mx-auto text-green-700 underline text-xs"
        >
          Continue without payment →
        </button>
      </div>
    )
  }

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
          Loading payment…
        </div>
      )}
      <div ref={containerRef} />
    </>
  )
}

// ── Thank-you screen ─────────────────────────────────────────────────────────

function ThankYou({ paymentCompleted }) {
  return (
    <div className="max-w-md w-full text-center mx-auto">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">✓</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        {paymentCompleted ? 'Booking Confirmed!' : 'Request Submitted!'}
      </h1>
      <p className="text-gray-600 mb-8">
        {paymentCompleted
          ? "Your deposit is received. We'll be in touch to confirm the pickup details."
          : "Thanks! We've received your request and will be in touch shortly with your quote."}
      </p>
      <div className="bg-white border border-gray-200 rounded-xl p-4 text-left mb-8">
        <p className="text-sm text-gray-500 mb-2">What happens next?</p>
        <ol className="text-sm text-gray-700 space-y-2">
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">1.</span>
            Our team reviews your photos and details
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">2.</span>
            {paymentCompleted
              ? "We'll confirm your pickup date and time"
              : "We'll email you a custom quote"}
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">3.</span>
            Your junk gets hauled away
          </li>
        </ol>
      </div>
      <Link
        href="/"
        className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}

// ── Main content ─────────────────────────────────────────────────────────────

function SuccessContent() {
  const searchParams = useSearchParams()
  const leadId = searchParams.get('id')
  const pm = searchParams.get('pm')                        // payment mode passed from form submit
  const redirectStatus = searchParams.get('redirect_status') // set by Stripe after embedded checkout

  const paymentCompleted = redirectStatus === 'succeeded'
  const needsPayment = pm && pm !== 'off' && !redirectStatus

  const [stage, setStage] = useState(needsPayment ? 'payment' : 'done')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/">
            <img src="/logo.png" alt="TrashThat" className="h-12 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        {stage === 'done' && <ThankYou paymentCompleted={paymentCompleted} />}

        {stage === 'payment' && (
          <div className="max-w-lg w-full">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✓</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Request received!</h1>
              <p className="text-sm text-gray-500 mt-1">
                Complete your deposit below to lock in your booking.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <EmbeddedCheckout
                leadId={leadId}
                onComplete={() => setStage('done')}
              />
            </div>
            <button
              onClick={() => setStage('done')}
              className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600"
            >
              Skip for now →
            </button>
          </div>
        )}
      </main>

      <footer className="bg-green-900 text-green-200 text-sm py-6 px-4 text-center">
        <p>&copy; {new Date().getFullYear()} TrashThat. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading…</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
