import type { OptionKey } from '../types'

interface FeedbackPanelProps {
  correct: boolean
  answerLetter: OptionKey
  answerText: string
  explanation: string
}

export default function FeedbackPanel({ correct, answerLetter, answerText, explanation }: FeedbackPanelProps) {
  return (
    <div
      className={
        'animate-fade-in-up mt-5 rounded-2xl border p-5 ' +
        (correct ? 'border-emerald-100 bg-emerald-50/70' : 'border-brand-100 bg-brand-50/70')
      }
    >
      <div className={'flex items-center gap-2 text-[15px] font-bold ' + (correct ? 'text-emerald-600' : 'text-red-500')}>
        {correct ? (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
            Chính xác
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4Z" clipRule="evenodd" /></svg>
            Chưa đúng
          </>
        )}
      </div>
      <p className="mt-2 text-[15px] font-semibold text-ink-900">
        Đáp án đúng: <span className="text-brand-700">{answerLetter}. {answerText}</span>
      </p>
      {explanation && (
        <div className="mt-3 border-t border-brand-100/80 pt-3">
          <p className="text-xs font-bold tracking-wide text-brand-500 uppercase">Giải thích</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">{explanation}</p>
        </div>
      )}
    </div>
  )
}
