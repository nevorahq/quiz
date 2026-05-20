'use client'

import { BlockInfo, Language } from '@/types/quiz'
import { getTranslations } from '@/lib/translations'
import { TOTAL_BLOCKS, TOTAL_QUESTIONS } from '@/data/questions'

interface QuizBlockHeaderProps {
  blockInfo: BlockInfo
  language: Language
  /** Index of the first question in this block (used to render question count) */
  firstQuestionIndex: number
  onContinue: () => void
  onBack: () => void
}

// Block colour tokens — full class strings only
const BLOCK_BG: Record<number, string> = {
  1: 'from-blue-500 to-blue-600',
  2: 'from-violet-500 to-violet-600',
  3: 'from-amber-500 to-amber-600',
  4: 'from-emerald-500 to-emerald-600',
  5: 'from-teal-500 to-teal-600',
  6: 'from-rose-500 to-rose-600',
  7: 'from-indigo-500 to-indigo-600',
}

const BLOCK_ICON_BG: Record<number, string> = {
  1: 'bg-blue-400',
  2: 'bg-violet-400',
  3: 'bg-amber-400',
  4: 'bg-emerald-400',
  5: 'bg-teal-400',
  6: 'bg-rose-400',
  7: 'bg-indigo-400',
}

// Simple icons per block
const BLOCK_ICONS: Record<number, React.ReactNode> = {
  1: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  ),
  2: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
      <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
      <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
    </svg>
  ),
  3: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
    </svg>
  ),
  4: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
      <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
    </svg>
  ),
  5: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
      <path d="M11.625 16.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z" />
      <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 0 0 1.06-1.06l-1.047-1.048A3.375 3.375 0 1 0 11.625 18Z" clipRule="evenodd" />
      <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-2.25Z" />
    </svg>
  ),
  6: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
    </svg>
  ),
  7: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
  ),
}

export default function QuizBlockHeader({
  blockInfo,
  language,
  firstQuestionIndex,
  onContinue,
  onBack,
}: QuizBlockHeaderProps) {
  const t = getTranslations(language)
  const gradient = BLOCK_BG[blockInfo.block] ?? 'from-slate-500 to-slate-600'
  const iconBg = BLOCK_ICON_BG[blockInfo.block] ?? 'bg-slate-400'
  const icon = BLOCK_ICONS[blockInfo.block]

  // How many questions remain from this block onward
  const questionsFromHere = TOTAL_QUESTIONS - firstQuestionIndex

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Coloured header card */}
        <div
          className={`quiz-card-enter rounded-2xl bg-linear-to-br ${gradient} p-7 text-white shadow-lg mb-6`}
        >
          <div className="flex items-start gap-4">
            <div className={`rounded-xl ${iconBg} p-3 shrink-0`}>{icon}</div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-75">
                {t.blockLabel} {blockInfo.block} / {TOTAL_BLOCKS}
              </p>
              <h2 className="text-2xl font-bold leading-tight">{blockInfo.title}</h2>
              <p className="text-sm leading-relaxed opacity-90">{blockInfo.goal}</p>
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm mb-6 flex items-center justify-between text-sm text-slate-500">
          <span>
            {firstQuestionIndex + 1}–{Math.min(firstQuestionIndex + 99, TOTAL_QUESTIONS)} {t.ofLabel} {TOTAL_QUESTIONS}
          </span>
          <span className="font-medium text-slate-700">{questionsFromHere} left</span>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {blockInfo.block > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
              {t.backButton}
            </button>
          )}
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-700"
          >
            {t.continueButton}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
