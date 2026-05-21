'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { QuizMessages } from '@/lib/getQuizMessages'

interface IntroHeroProps {
  locale: string
  msg: QuizMessages
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function IntroHero({ locale, msg }: IntroHeroProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center gap-6 max-w-lg mx-auto px-4"
    >
      {/* Badge */}
      <motion.span
        variants={item}
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase"
        style={{
          background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.3)',
          color: '#818CF8',
        }}
      >
        {msg.intro.badge}
      </motion.span>

      {/* Title */}
      <motion.h1
        variants={item}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          lineHeight: 1.15,
          color: '#F1F5F9',
        }}
      >
        {msg.intro.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={item}
        className="text-base leading-relaxed max-w-sm"
        style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}
      >
        {msg.intro.subtitle}
      </motion.p>

      {/* CTA */}
      <motion.div variants={item}>
        <Link
          href={`/${locale}/quiz`}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ background: '#6366F1' }}
        >
          {msg.intro.cta}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </motion.div>

      {/* Privacy note */}
      <motion.p
        variants={item}
        className="text-xs"
        style={{ color: '#475569', fontFamily: 'var(--font-body)' }}
      >
        {msg.intro.privacy}
      </motion.p>
    </motion.div>
  )
}
