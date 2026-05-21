'use client'

import { usePathname, useRouter } from 'next/navigation'

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'ro', label: 'RO' },
  { code: 'ru', label: 'RU' },
] as const

interface LanguageSwitcherProps {
  locale: string
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: string) {
    // Pathname is e.g. /en/quiz — replace first segment with new locale
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/') || '/')
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full px-1 py-1"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      role="navigation"
      aria-label="Language switcher"
    >
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          aria-current={locale === code ? 'true' : undefined}
          onClick={() => switchLocale(code)}
          className="rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{
            background: locale === code ? 'rgba(255,255,255,0.12)' : 'transparent',
            color: locale === code ? '#F1F5F9' : '#64748B',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
