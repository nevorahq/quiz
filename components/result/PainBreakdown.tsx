'use client'

import { motion } from 'framer-motion'
import { getQuizMessages, t } from '@/lib/getQuizMessages'

interface PainBreakdownProps {
  insights: string[]
  locale: string
}

export default function PainBreakdown({ insights, locale }: PainBreakdownProps) {
  const msg = getQuizMessages(locale)

  return (
    <div className="space-y-4">
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: '#CBD5E1',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {msg.result.insights_title}
      </p>
      <ul className="space-y-3">
        {insights.map((key, i) => (
          <motion.li
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
            className="flex items-start gap-3"
          >
            <span
              className="mt-[7px] shrink-0 rounded-full"
              style={{ width: 4, height: 4, background: '#6366F1' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: '#94A3B8',
                lineHeight: 1.65,
              }}
            >
              {t(msg, key)}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
