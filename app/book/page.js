'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const STEPS = [
  'Contact Info',
  'Service Address',
  'Photos',
  'Junk Details',
  'Access & Timing',
  'Review & Submit',
]

const ITEM_CATEGORIES = [
  'Furniture',
  'Appliances',
  'Mattresses',
  'Electronics',
  'Renovation Debris',
  'Yard Waste',
  'Office Equipment',
  'Clothing / Textiles',
  'Boxes / Misc',
  'Other',
]

const SPECIAL_ITEMS = [
  'Heavy items (pianos, safes, etc.)',
  'Appliances (fridge, washer, etc.)',
  'Mattresses',
  'Renovation / construction debris',
  'Hazardous materials',
]

const TIME_WINDOWS = [
  '8am – 10am',
  '10am – 12pm',
  '12pm – 2pm',
  '2pm – 4pm',
  '4pm – 6pm',
  'Flexible – any time',
]

const EMPTY_FORM = {
  // Step 1
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  // Step 2
  address: '',
  unit: '',
  postalCode: '',
  buzzerNote: '',
  // Step 3 — handled separately as File objects
  // Step 4
  whatNeedsRemoval: '',
  itemCategories: [],
  jobType: '',
  specialItems: [],
  junkNotes: '',
  // Step 5
  hasStairs: false,
  hasElevator: false,
  longCarry: false,
  parkingNotes: '',
  preferredDate: '',
  preferredTimeWindow: '',
}

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${
              i < current
                ? 'bg-green-600 text-white'
                : i === current
                ? 'bg-green-700 text-white ring-2 ring-green-300'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {i < current ? '✓' : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-6 h-0.5 shrink-0 ${
                i < current ? 'bg-green-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function FieldError({ msg }) {
  if (!msg) return null
  return <p className="text-red-600 text-xs mt-1">{msg}</p>
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function Input({ ...props }) {
  return (
    <input
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      {...props}
    />
  )
}

function Textarea({ ...props }) {
  return (
    <textarea
      rows={3}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
      {...props}
    />
  )
}

// ─── Step components ────────────────────────────────────────

function Step1({ data, update, errors }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>First Name</Label>
          <Input
            value={data.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            placeholder="Jane"
          />
          <FieldError msg={errors.firstName} />
        </div>
        <div>
          <Label required>Last Name</Label>
          <Input
            value={data.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            placeholder="Smith"
          />
          <FieldError msg={errors.lastName} />
        </div>
      </div>
      <div>
        <Label required>Phone Number</Label>
        <Input
          type="tel"
          value={data.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="(555) 000-0000"
        />
        <FieldError msg={errors.phone} />
      </div>
      <div>
        <Label required>Email Address</Label>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="jane@example.com"
        />
        <FieldError msg={errors.email} />
      </div>
    </div>
  )
}

function Step2({ data, update, errors }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Service Address</h2>
      <div>
        <Label required>Street Address</Label>
        <Input
          value={data.address}
          onChange={(e) => update('address', e.target.value)}
          placeholder="123 Main St"
        />
        <FieldError msg={errors.address} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Unit / Suite</Label>
          <Input
            value={data.unit}
            onChange={(e) => update('unit', e.target.value)}
            placeholder="Apt 4B"
          />
        </div>
        <div>
          <Label required>Postal Code</Label>
          <Input
            value={data.postalCode}
            onChange={(e) => update('postalCode', e.target.value.toUpperCase())}
            placeholder="A1B 2C3"
          />
          <FieldError msg={errors.postalCode} />
        </div>
      </div>
      <div>
        <Label>Buzzer / Gate Code or Note</Label>
        <Input
          value={data.buzzerNote}
          onChange={(e) => update('buzzerNote', e.target.value)}
          placeholder="Buzzer #204, gate code 1234"
        />
      </div>
    </div>
  )
}

function Step3({ photos, setPhotos, errors, photoLimits }) {
  const inputRef = useRef(null)
  const { min, max } = photoLimits

  function handleFiles(e) {
    const incoming = Array.from(e.target.files || [])
    const combined = [...photos, ...incoming].slice(0, max)
    setPhotos(combined)
    // reset input so same file can be re-added after removal
    e.target.value = ''
  }

  function remove(index) {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Upload Photos</h2>
      <p className="text-sm text-gray-500">
        Upload {min}–{max} photos of the items you need removed. Clear photos
        help us give you an accurate quote faster.
      </p>

      {/* Preview grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((file, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`photo-${i + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 hover:border-green-400 rounded-xl py-10 text-center text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
        >
          <span className="block text-3xl mb-2">📷</span>
          <span className="text-sm font-medium">
            Click to add photos ({photos.length}/{max})
          </span>
          <span className="block text-xs text-gray-400 mt-1">
            JPG, PNG, HEIC — up to {max} photos
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      <FieldError msg={errors.photos} />
    </div>
  )
}

function Step4({ data, update, errors }) {
  function toggleArray(key, value) {
    const current = data[key]
    update(
      key,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    )
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Junk Details</h2>

      <div>
        <Label required>What needs to be removed?</Label>
        <Textarea
          value={data.whatNeedsRemoval}
          onChange={(e) => update('whatNeedsRemoval', e.target.value)}
          placeholder="Describe what needs to go — e.g. old couch, broken TV stand, boxes of clothes, pile of scrap wood..."
        />
        <FieldError msg={errors.whatNeedsRemoval} />
      </div>

      <div>
        <Label>Item Categories</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {ITEM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleArray('itemCategories', cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                data.itemCategories.includes(cat)
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Rough Job Size</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
          {[
            { value: 'small', label: 'Small', desc: 'A few items' },
            { value: 'medium', label: 'Medium', desc: 'Half a truck' },
            { value: 'large', label: 'Large', desc: 'Full truck or more' },
          ].map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => update('jobType', value)}
              className={`border rounded-lg p-3 text-left transition-colors ${
                data.jobType === value
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs text-gray-500">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Any Special or Heavy Items?</Label>
        <div className="space-y-2 mt-1">
          {SPECIAL_ITEMS.map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.specialItems.includes(item)}
                onChange={() => toggleArray('specialItems', item)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Additional Notes</Label>
        <Textarea
          value={data.junkNotes}
          onChange={(e) => update('junkNotes', e.target.value)}
          placeholder="Anything else we should know about the items or the job..."
        />
      </div>
    </div>
  )
}

function Step5({ data, update, errors }) {
  // Minimum date = tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Access & Preferred Time</h2>

      <div>
        <Label>Access Conditions</Label>
        <div className="space-y-2 mt-1">
          {[
            { key: 'hasStairs', label: 'There are stairs involved' },
            { key: 'hasElevator', label: 'Elevator available (if applicable)' },
            { key: 'longCarry', label: 'Long carry distance from truck to items' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data[key]}
                onChange={(e) => update(key, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Parking / Truck Access Notes</Label>
        <Textarea
          value={data.parkingNotes}
          onChange={(e) => update('parkingNotes', e.target.value)}
          placeholder="Street parking only, loading zone nearby, tight driveway, etc."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Preferred Date</Label>
          <Input
            type="date"
            min={minDate}
            value={data.preferredDate}
            onChange={(e) => update('preferredDate', e.target.value)}
          />
          <FieldError msg={errors.preferredDate} />
        </div>
        <div>
          <Label required>Preferred Time Window</Label>
          <select
            value={data.preferredTimeWindow}
            onChange={(e) => update('preferredTimeWindow', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a time window</option>
            {TIME_WINDOWS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError msg={errors.preferredTimeWindow} />
        </div>
      </div>
    </div>
  )
}

function Step6({ data, photos }) {
  const sections = [
    {
      title: 'Contact',
      rows: [
        ['Name', `${data.firstName} ${data.lastName}`],
        ['Phone', data.phone],
        ['Email', data.email],
      ],
    },
    {
      title: 'Service Address',
      rows: [
        ['Address', [data.address, data.unit].filter(Boolean).join(', ')],
        ['Postal Code', data.postalCode],
        data.buzzerNote ? ['Buzzer / Gate', data.buzzerNote] : null,
      ].filter(Boolean),
    },
    {
      title: 'Junk Details',
      rows: [
        ['Description', data.whatNeedsRemoval],
        data.itemCategories.length
          ? ['Categories', data.itemCategories.join(', ')]
          : null,
        data.jobType ? ['Job Size', data.jobType] : null,
        data.specialItems.length
          ? ['Special Items', data.specialItems.join(', ')]
          : null,
        data.junkNotes ? ['Notes', data.junkNotes] : null,
      ].filter(Boolean),
    },
    {
      title: 'Access & Timing',
      rows: [
        [
          'Access',
          [
            data.hasStairs ? 'Stairs' : null,
            data.hasElevator ? 'Elevator' : null,
            data.longCarry ? 'Long carry' : null,
          ]
            .filter(Boolean)
            .join(', ') || 'Standard',
        ],
        data.parkingNotes ? ['Parking', data.parkingNotes] : null,
        ['Preferred Date', data.preferredDate],
        ['Time Window', data.preferredTimeWindow],
      ].filter(Boolean),
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Review Your Request</h2>
      <p className="text-sm text-gray-500">
        Please review your details before submitting. Use the Back button to
        make changes.
      </p>

      {sections.map((section) => (
        <div key={section.title} className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">{section.title}</h3>
          </div>
          <dl className="divide-y divide-gray-100">
            {section.rows.map(([label, value]) => (
              <div key={label} className="px-4 py-2.5 flex gap-4 text-sm">
                <dt className="text-gray-500 w-32 shrink-0">{label}</dt>
                <dd className="text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      {photos.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Photos ({photos.length})
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={`preview-${i + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Validation ─────────────────────────────────────────────

function validateStep(step, data, photos, photoLimits) {
  const errors = {}
  if (step === 0) {
    if (!data.firstName.trim()) errors.firstName = 'First name is required.'
    if (!data.lastName.trim()) errors.lastName = 'Last name is required.'
    if (!data.phone.trim()) errors.phone = 'Phone number is required.'
    if (!data.email.trim()) errors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = 'Enter a valid email address.'
  }
  if (step === 1) {
    if (!data.address.trim()) errors.address = 'Street address is required.'
    if (!data.postalCode.trim()) errors.postalCode = 'Postal code is required.'
  }
  if (step === 2) {
    if (photos.length < photoLimits.min)
      errors.photos = `Please upload at least ${photoLimits.min} photos.`
  }
  if (step === 3) {
    if (!data.whatNeedsRemoval.trim())
      errors.whatNeedsRemoval = 'Please describe what needs to be removed.'
  }
  if (step === 4) {
    if (!data.preferredDate) errors.preferredDate = 'Please choose a preferred date.'
    if (!data.preferredTimeWindow)
      errors.preferredTimeWindow = 'Please choose a time window.'
  }
  return errors
}

// ─── Main page ───────────────────────────────────────────────

export default function BookPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [photos, setPhotos] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Photo limits — could later be fetched from settings API
  const photoLimits = { min: 4, max: 8 }

  function update(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleNext() {
    const errs = validateStep(step, formData, photos, photoLimits)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    setErrors({})
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError(null)

    try {
      // 1. Upload photos
      const uploadedUrls = []
      for (const file of photos) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('Photo upload failed.')
        const { url } = await res.json()
        uploadedUrls.push({ url, filename: file.name })
      }

      // 2. Submit lead
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, photos: uploadedUrls }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Submission failed. Please try again.')
      }

      const { leadId, paymentMode } = await res.json()
      const successUrl = paymentMode && paymentMode !== 'off'
        ? `/book/success?id=${leadId}&pm=${paymentMode}`
        : `/book/success?id=${leadId}`
      router.push(successUrl)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const stepProps = { data: formData, update, errors }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="TrashThat" className="h-12 w-auto" />
          </Link>
          <span className="text-sm text-gray-500">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator current={step} />
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {step === 0 && <Step1 {...stepProps} />}
          {step === 1 && <Step2 {...stepProps} />}
          {step === 2 && (
            <Step3
              photos={photos}
              setPhotos={setPhotos}
              errors={errors}
              photoLimits={photoLimits}
            />
          )}
          {step === 3 && <Step4 {...stepProps} />}
          {step === 4 && <Step5 {...stepProps} />}
          {step === 5 && <Step6 data={formData} photos={photos} />}

          {submitError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {submitError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                &larr; Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Continue &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
