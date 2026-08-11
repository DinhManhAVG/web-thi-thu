import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../lib/store'
import type { OptionKey } from '../types'
import QuizCard from '../components/QuizCard'
import ProgressBar from '../components/ProgressBar'
import OptionButton from '../components/OptionButton'
import FeedbackPanel from '../components/FeedbackPanel'

const LETTERS: OptionKey[] = ['A', 'B', 'C', 'D']

export default function Quiz() {
  const navigate = useNavigate()
  const { questions, current, answers, revealed, selectAnswer, reveal, next, finish } = useSession()

  const q = questions[current]

  useEffect(() => {
    if (!questions.length) navigate('/', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length])

  useEffect(() => {
    if (!q) return
    const isRevealed = !!revealed[q.id]
    const onKey = (e: KeyboardEvent) => {
      if (!isRevealed) {
        const idx = ['1', '2', '3', '4', 'a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase())
        if (idx >= 0) handleSelect(LETTERS[idx % 4])
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        handleNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  if (!q) return null

  const record = answers[q.id]
  const isRevealed = !!revealed[q.id]
  const isLast = current === questions.length - 1

  function handleSelect(letter: OptionKey) {
    if (isRevealed) return
    selectAnswer(q.id, letter)
    reveal(q.id)
  }

  function handleNext() {
    if (!isRevealed) return
    if (isLast) {
      finish()
      navigate('/results')
    } else {
      next()
    }
  }

  function handleExit() {
    if (confirm('Thoát khỏi bài ôn tập? Tiến trình hiện tại sẽ không được lưu.')) {
      navigate('/')
    }
  }

  return (
    <QuizCard>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-400">
          Câu {current + 1}/{questions.length}
        </span>
        <button
          onClick={handleExit}
          className="rounded-full p-1.5 text-ink-400 transition-colors hover:bg-slate-100 hover:text-ink-600"
          aria-label="Thoát"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="mt-2">
        <ProgressBar value={(current + 1) / questions.length} />
      </div>

      <h1 className="mt-5 text-2xl font-extrabold text-ink-900">Trắc nghiệm Tư tưởng Hồ Chí Minh</h1>
      <p className="mt-1 text-sm text-ink-400">Chọn một đáp án. Kết quả và giải thích sẽ hiện ngay.</p>

      <p className="mt-6 text-lg leading-snug font-bold text-ink-900">{q.question}</p>

      <div className="mt-5 flex flex-col gap-3">
        {LETTERS.map((letter) => {
          let state: 'default' | 'selected' | 'correct' | 'wrong' | 'dim' = 'default'
          if (isRevealed) {
            if (letter === q.answer) state = 'correct'
            else if (letter === record?.selected) state = 'wrong'
            else state = 'dim'
          } else if (letter === record?.selected) {
            state = 'selected'
          }
          return (
            <OptionButton
              key={letter}
              letter={letter}
              text={q.options[letter]}
              state={state}
              disabled={isRevealed}
              onClick={() => handleSelect(letter)}
            />
          )
        })}
      </div>

      {isRevealed && (
        <>
          <FeedbackPanel
            correct={!!record?.correct}
            answerLetter={q.answer}
            answerText={q.options[q.answer]}
            explanation={q.explanation}
          />
          <button
            onClick={handleNext}
            className="mt-5 w-full rounded-2xl bg-brand-600 py-3.5 text-center text-[15px] font-bold text-white shadow-soft transition-colors hover:bg-brand-700 sm:ml-auto sm:w-auto sm:px-8"
          >
            {isLast ? 'Xem kết quả' : 'Câu tiếp theo →'}
          </button>
        </>
      )}
    </QuizCard>
  )
}
