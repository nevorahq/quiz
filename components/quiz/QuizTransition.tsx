'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface QuizTransitionProps {
  motionKey: string
  direction: 'forward' | 'backward'
  children: React.ReactNode
}

const DURATION = 0.3

export default function QuizTransition({
  motionKey,
  direction,
  children,
}: QuizTransitionProps) {
  const prefersReducedMotion = useReducedMotion()

  const forward = direction === 'forward'

  // When prefers-reduced-motion: translate is removed, only opacity animates
  const initial = prefersReducedMotion
    ? { opacity: 0 }
    : { x: forward ? 100 : -100, opacity: 0 }

  const animate = prefersReducedMotion
    ? { opacity: 1 }
    : { x: 0, opacity: 1 }

  const exit = prefersReducedMotion
    ? { opacity: 0 }
    : { x: forward ? -100 : 100, opacity: 0 }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={motionKey}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{ duration: DURATION, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
