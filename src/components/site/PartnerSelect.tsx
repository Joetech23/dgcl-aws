'use client'

import { useEffect, useRef, useState } from 'react'
import { listPartners, type PartnerOption } from '@/lib/backend'

/**
 * "Referred by a partner?" as a list the admin controls (Admin > Partners),
 * instead of a code the learner has to type. The value is the partner's code.
 *
 * A partner link (?ref=CODE) still works: it preselects that partner. If the
 * list cannot load, the field is hidden and a code from a link is still sent.
 */
export function PartnerSelect({
  value,
  onChange,
  id = 'partner',
  className = '',
  selectClassName,
}: {
  value: string
  onChange: (code: string) => void
  id?: string
  className?: string
  selectClassName?: string
}) {
  const [options, setOptions] = useState<PartnerOption[] | null>(null)
  // The form may fill in a code from a partner link after this mounts.
  const latest = useRef(value)
  latest.current = value

  useEffect(() => {
    let live = true
    void listPartners().then((list) => {
      if (!live) return
      setOptions(list)
      // A code from an old or switched-off partner is dropped once the list is known.
      const current = latest.current
      if (list.length && current && !list.some((p) => p.code === current)) onChange('')
    })
    return () => {
      live = false
    }
    // Only on first load: later changes are the learner's own choice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!options?.length) return null
  return (
    <div className={className}>
      <label htmlFor={id} className="font-display text-[13px] font-bold text-ink">
        Referred by a partner? <span className="font-normal text-ink/45">(optional)</span>
      </label>
      <select
        id={id}
        name="partner"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          selectClassName ??
          'mt-1.5 block h-12 w-full rounded-xl border border-line bg-surface px-3 text-[15px] text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10'
        }
      >
        <option value="">No partner</option>
        {options.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}
