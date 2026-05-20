'use client'

interface QuizScaleAnswerProps {
  value: string
  scaleLow?: string
  scaleHigh?: string
  onChange: (value: string) => void
}

const SCALE_VALUES = ['1', '2', '3', '4', '5'] as const

// Active ring colours per scale value (emotional gradient low→high)
const ACTIVE_STYLES: Record<string, string> = {
  '1': 'bg-blue-500 text-white border-blue-500 shadow-blue-100',
  '2': 'bg-teal-500 text-white border-teal-500 shadow-teal-100',
  '3': 'bg-amber-500 text-white border-amber-500 shadow-amber-100',
  '4': 'bg-orange-500 text-white border-orange-500 shadow-orange-100',
  '5': 'bg-rose-500 text-white border-rose-500 shadow-rose-100',
}

export default function QuizScaleAnswer({
  value,
  scaleLow,
  scaleHigh,
  onChange,
}: QuizScaleAnswerProps) {
  return (
    <div className="space-y-4">
      {/* Scale buttons */}
      <div className="flex gap-3 justify-center">
        {SCALE_VALUES.map((v) => {
          const isActive = value === v
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`h-14 w-14 rounded-xl border-2 text-xl font-semibold transition-all duration-200 shadow-sm ${
                isActive
                  ? `${ACTIVE_STYLES[v]} scale-110 shadow-lg`
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
              aria-pressed={isActive}
              aria-label={`Scale value ${v}`}
            >
              {v}
            </button>
          )
        })}
      </div>

      {/* Low / High labels */}
      {(scaleLow || scaleHigh) && (
        <div className="flex justify-between px-1 text-xs text-slate-400">
          <span>{scaleLow}</span>
          <span>{scaleHigh}</span>
        </div>
      )}
    </div>
  )
}
