'use client'

import { motion } from 'framer-motion'
import { QuestionOption } from '@/types/quiz'
import { getQuizMessages, t } from '@/lib/getQuizMessages'

interface QuizChoiceAnswerProps {
  options: QuestionOption[]
  selected: string
  onSelect: (value: string) => void
  locale: string
}

export default function QuizChoiceAnswer({
  options,
  selected,
  onSelect,
  locale,
}: QuizChoiceAnswerProps) {
  const msg = getQuizMessages(locale)

  return (
    <div role="radiogroup" className="flex flex-col gap-3">
      {options.map((option) => {
        const isSelected = selected === option.value
        const label = t(msg, option.labelKey)

        return (
          <motion.button
            key={option.value}
            type="button"
            layout
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-full px-5 py-4 text-left text-sm font-medium rounded-[9999px] border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              background: isSelected ? '#6366F1' : 'transparent',
              borderColor: isSelected ? '#6366F1' : 'rgba(255,255,255,0.12)',
              color: isSelected ? '#ffffff' : '#F1F5F9',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = '#818CF8'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              }
            }}
          >
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}
