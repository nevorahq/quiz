'use client'

interface QuizChoiceAnswerProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function QuizChoiceAnswer({
  options,
  value,
  onChange,
}: QuizChoiceAnswerProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = value === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`w-full rounded-xl border-2 px-5 py-4 text-left text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'border-slate-700 bg-slate-700 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
            aria-pressed={isSelected}
          >
            <span className="flex items-center gap-3">
              {/* Indicator dot */}
              <span
                className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors duration-200 ${
                  isSelected
                    ? 'border-white bg-white'
                    : 'border-slate-300 bg-transparent'
                }`}
              />
              {option}
            </span>
          </button>
        )
      })}
    </div>
  )
}
