import type { OptionKey } from '../types'
import { cx } from '../lib/utils'

interface OptionButtonProps {
  letter: OptionKey
  text: string
  state: 'default' | 'selected' | 'correct' | 'wrong' | 'dim'
  disabled?: boolean
  onClick?: () => void
}

const badgeStyles: Record<OptionButtonProps['state'], string> = {
  default: 'bg-brand-100 text-brand-600',
  selected: 'bg-brand-600 text-white',
  correct: 'bg-emerald-500 text-white',
  wrong: 'bg-red-500 text-white',
  dim: 'bg-slate-100 text-slate-400',
}

const cardStyles: Record<OptionButtonProps['state'], string> = {
  default: 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/50',
  selected: 'border-brand-500 bg-brand-50 shadow-soft',
  correct: 'border-emerald-400 bg-emerald-50 shadow-soft',
  wrong: 'border-red-400 bg-red-50 shadow-soft animate-shake',
  dim: 'border-slate-100 bg-slate-50/60 opacity-70',
}

export default function OptionButton({ letter, text, state, disabled, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'group flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-150',
        'disabled:cursor-default',
        cardStyles[state],
      )}
    >
      <span
        className={cx(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors',
          badgeStyles[state],
        )}
      >
        {letter}
      </span>
      <span
        className={cx(
          'text-[15px] leading-snug font-medium',
          state === 'dim' ? 'text-slate-400' : 'text-ink-800',
        )}
      >
        {text}
      </span>
      {state === 'correct' && (
        <svg viewBox="0 0 20 20" fill="currentColor" className="ml-auto h-5 w-5 shrink-0 text-emerald-500">
          <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
        </svg>
      )}
      {state === 'wrong' && (
        <svg viewBox="0 0 20 20" fill="currentColor" className="ml-auto h-5 w-5 shrink-0 text-red-500">
          <path fillRule="evenodd" d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4Z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}
