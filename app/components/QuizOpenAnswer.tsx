'use client'

import { useEffect, useRef } from 'react'
import { getTranslations } from '@/lib/translations'
import { Language } from '@/types/quiz'

interface QuizOpenAnswerProps {
  questionId: number
  value: string
  placeholder?: string
  language: Language
  onChange: (value: string) => void
}

export default function QuizOpenAnswer({
  questionId,
  value,
  placeholder,
  language,
  onChange,
}: QuizOpenAnswerProps) {
  const t = getTranslations(language)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea height as user types
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  // Refocus when question changes
  useEffect(() => {
    textareaRef.current?.focus()
  }, [questionId])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? t.answerPlaceholder}
      rows={4}
      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 leading-relaxed"
    />
  )
}
