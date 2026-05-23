'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// Tracks SPA navigations as $pageview events
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()

  useEffect(() => {
    if (!pathname || !ph) return
    const url =
      window.location.origin +
      pathname +
      (searchParams.toString() ? `?${searchParams}` : '')
    ph.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams, ph])

  return null
}

if (typeof window !== 'undefined') {
  posthog.init("phc_mC4GDak8ds6JSACbA6ttnEuuet79kaa9gk4eeSoBVMrf", {
    api_host: "https://eu.i.posthog.com",
    ui_host: 'https://eu.posthog.com',
    capture_pageview: false, // handled manually by PostHogPageView
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
  })
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
