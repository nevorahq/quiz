'use client'

import { motion } from 'framer-motion'

interface QuizScaleAnswerProps {
  selected: string
  onSelect: (value: string) => void
  scaleLow?: string
  scaleHigh?: string
}

const SCALE_VALUES = ['1', '2', '3', '4', '5'] as const

export default function QuizScaleAnswer({
  selected,
  onSelect,
  scaleLow,
  scaleHigh,
}: QuizScaleAnswerProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Dots row */}
      <div className="flex items-center gap-4">
        {SCALE_VALUES.map((v) => {
          const isSelected = selected === v

          return (
            <motion.button
              key={v}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${v} of 5`}
              onClick={() => onSelect(v)}
              animate={{
                width: isSelected ? 36 : 24,
                height: isSelected ? 36 : 24,
                backgroundColor: isSelected ? '#6366F1' : 'rgba(255,255,255,0.12)',
                borderColor: isSelected ? '#6366F1' : 'rgba(255,255,255,0.2)',
              }}
              whileHover={{
                scale: 1.15,
                borderColor: '#818CF8',
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ flexShrink: 0 }}
            />
          )
        })}
      </div>

      {/* Endpoint labels */}
      {(scaleLow || scaleHigh) && (
        <div
          className="flex w-full justify-between text-xs text-slate-400"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span>{scaleLow}</span>
          <span>{scaleHigh}</span>
        </div>
      )}
    </div>
  )
}
