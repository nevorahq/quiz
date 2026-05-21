'use client'

import { motion } from 'framer-motion'
import { QuestionOption } from '@/types/quiz'
import { getQuizMessages, t } from '@/lib/getQuizMessages'

interface QuizMultiAnswerProps {
  options: QuestionOption[]
  selected: string[]
  onSelect: (values: string[]) => void
  locale: string
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function QuizMultiAnswer({
  options,
  selected,
  onSelect,
  locale,
}: QuizMultiAnswerProps) {
  const msg = getQuizMessages(locale)
  const allValues = options.map((o) => o.value)
  const allSelected = allValues.every((v) => selected.includes(v))

  function toggle(value: string) {
    if (selected.includes(value)) {
      onSelect(selected.filter((v) => v !== value))
    } else {
      onSelect([...selected, value])
    }
  }

  function toggleAll() {
    if (allSelected) {
      onSelect([])
    } else {
      // "All of the above" — selects all individual option values and clears others
      onSelect(allValues)
    }
  }

  return (
    <div role="group" aria-label={t(msg, 'q12.question')} className="flex flex-col gap-3">
      {options.map((option) => {
        const isSelected = selected.includes(option.value)
        const label = t(msg, option.labelKey)

        return (
          <motion.button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            onClick={() => toggle(option.value)}
            layout
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-3 w-full px-5 py-4 text-left text-sm font-medium rounded-[9999px] border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              background: isSelected ? '#6366F1' : 'transparent',
              borderColor: isSelected ? '#6366F1' : 'rgba(255,255,255,0.12)',
              color: isSelected ? '#ffffff' : '#F1F5F9',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.borderColor = '#818CF8'
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            }}
          >
            {/* Checkbox indicator */}
            <span
              className="flex items-center justify-center rounded-sm border transition-colors duration-200"
              style={{
                width: 18,
                height: 18,
                flexShrink: 0,
                background: isSelected ? 'rgba(255,255,255,0.25)' : 'transparent',
                borderColor: isSelected ? 'transparent' : 'rgba(255,255,255,0.3)',
              }}
            >
              {isSelected && <CheckIcon />}
            </span>
            <span>{label}</span>
          </motion.button>
        )
      })}

      {/* "All of the above" — clears individual selections and selects all */}
      <motion.button
        type="button"
        role="checkbox"
        aria-checked={allSelected}
        onClick={toggleAll}
        layout
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="flex items-center gap-3 w-full px-5 py-4 text-left text-sm font-medium rounded-[9999px] border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{
          background: allSelected ? '#6366F1' : 'transparent',
          borderColor: allSelected ? '#6366F1' : 'rgba(255,255,255,0.12)',
          color: allSelected ? '#ffffff' : '#94A3B8',
        }}
        onMouseEnter={(e) => {
          if (!allSelected) e.currentTarget.style.borderColor = '#818CF8'
        }}
        onMouseLeave={(e) => {
          if (!allSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
        }}
      >
        <span
          className="flex items-center justify-center rounded-sm border transition-colors duration-200"
          style={{
            width: 18,
            height: 18,
            flexShrink: 0,
            background: allSelected ? 'rgba(255,255,255,0.25)' : 'transparent',
            borderColor: allSelected ? 'transparent' : 'rgba(255,255,255,0.3)',
          }}
        >
          {allSelected && <CheckIcon />}
        </span>
        <span>All of the above</span>
      </motion.button>
    </div>
  )
}
