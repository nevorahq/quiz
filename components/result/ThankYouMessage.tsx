'use client'

import { motion } from 'framer-motion'
import { getQuizMessages } from '@/lib/getQuizMessages'

interface ThankYouMessageProps {
  locale: string
}

export default function ThankYouMessage({ locale }: ThankYouMessageProps) {
  const msg = getQuizMessages(locale)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-2xl p-7 text-center space-y-4"
      style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
    >
      <div className="flex justify-center">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: 'rgba(16,185,129,0.15)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12l5 5L20 7"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F1F5F9' }}>
        {msg.result.success_title}
      </p>
      <p className="text-sm" style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
        {msg.result.success_subtitle}
      </p>
    </motion.div>
  )
}
