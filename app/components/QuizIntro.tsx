'use client'

import { Language } from '@/types/quiz'
import { getTranslations } from '@/lib/translations'
import { TOTAL_QUESTIONS, TOTAL_BLOCKS } from '@/data/questions'

interface QuizIntroProps {
  onStart: (language: Language) => void
}

const LANGUAGES: Language[] = ['en', 'ro', 'ru']

const LANG_FLAGS: Record<Language, string> = {
  en: '🇬🇧',
  ro: '🇷🇴',
  ru: '🇷🇺',
}

// Native name for each language — same in every locale
const LANG_NATIVE: Record<Language, string> = {
  en: 'English',
  ro: 'Română',
  ru: 'Русский',
}

export default function QuizIntro({ onStart }: QuizIntroProps) {
  // Show interface in all 3 languages simultaneously so the user picks
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-slate-50 to-white px-4 py-12">
      <div className="w-full max-w-lg space-y-10">
        {/* Logo / icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm space-y-6">
          {/* Stats row */}
          <div className="flex gap-6 justify-center text-center">
            <div>
              <div className="text-3xl font-bold text-slate-800">{TOTAL_QUESTIONS}</div>
              <div className="text-xs text-slate-500 mt-0.5">questions / întrebări / вопросов</div>
            </div>
            <div className="w-px bg-slate-100" />
            <div>
              <div className="text-3xl font-bold text-slate-800">{TOTAL_BLOCKS}</div>
              <div className="text-xs text-slate-500 mt-0.5">blocks / blocuri / блоков</div>
            </div>
            <div className="w-px bg-slate-100" />
            <div>
              <div className="text-3xl font-bold text-slate-800">~15</div>
              <div className="text-xs text-slate-500 mt-0.5">min</div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Select language heading */}
          <p className="text-center text-sm font-medium text-slate-500">
            Choose language · Alegeți limba · Выберите язык
          </p>

          {/* Language buttons */}
          <div className="grid grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => {
              const t = getTranslations(lang)
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onStart(lang)}
                  className="group flex flex-col items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 py-5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-700 hover:text-white"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {LANG_FLAGS[lang]}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-white transition-colors duration-200">
                    {LANG_NATIVE[lang]}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-white transition-colors duration-200">
                    {t.startButton}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Research title */}
        <p className="text-center text-xs text-slate-400 leading-relaxed">
          Personal Finance & Task Management Research
          <br />
          Cercetare: Finanțe personale și gestionarea sarcinilor
          <br />
          Исследование: Личные финансы и управление задачами
        </p>
      </div>
    </div>
  )
}
