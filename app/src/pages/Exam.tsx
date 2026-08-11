import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../lib/store'
import { useAntiCheat } from '../hooks/useAntiCheat'
import type { OptionKey } from '../types'
import ProgressBar from '../components/ProgressBar'
import OptionButton from '../components/OptionButton'
import { cx, formatTime } from '../lib/utils'

const LETTERS: OptionKey[] = ['A', 'B', 'C', 'D']

export default function Exam() {
  const navigate = useNavigate()
  const { questions, current, answers, selectAnswer, goTo, finish, addViolation, startedAt } = useSession()
  const [phase, setPhase] = useState<'intro' | 'active'>('intro')
  const [toast, setToast] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const { violationCount, enterFullscreen, exitFullscreen } = useAntiCheat({
    active: phase === 'active',
    onViolation: (reason) => {
      addViolation()
      setToast(reason)
    },
  })

  useEffect(() => {
    if (!questions.length) navigate('/', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length])

  useEffect(() => {
    if (phase !== 'active') return
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - (startedAt ?? Date.now())) / 1000)), 1000)
    return () => clearInterval(t)
  }, [phase, startedAt])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  if (!questions.length) return null
  const q = questions[current]
  const answeredCount = Object.keys(answers).length

  async function handleBegin() {
    await enterFullscreen()
    setPhase('active')
  }

  async function handleSubmit() {
    if (answeredCount < questions.length) {
      const ok = confirm(`Bạn còn ${questions.length - answeredCount} câu chưa trả lời. Vẫn nộp bài?`)
      if (!ok) return
    } else if (!confirm('Nộp bài thi thử?')) {
      return
    }
    await exitFullscreen()
    finish()
    navigate('/results')
  }

  if (phase === 'intro') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-white bg-white/90 p-8 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-fuchsia-400 text-2xl">
            🛡️
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-ink-900">Sẵn sàng thi thử?</h1>
          <p className="mt-2 text-sm text-ink-400">{questions.length} câu hỏi · không giới hạn thời gian</p>
          <ul className="mt-6 space-y-2.5 text-left text-sm text-ink-600">
            <li className="flex gap-2.5"><span className="text-brand-500">●</span> Bài thi chuyển sang chế độ toàn màn hình.</li>
            <li className="flex gap-2.5"><span className="text-brand-500">●</span> Đáp án &amp; giải thích chỉ hiện sau khi nộp bài.</li>
            <li className="flex gap-2.5"><span className="text-brand-500">●</span> Thoát toàn màn hình hoặc chuyển tab sẽ được ghi nhận là một lần vi phạm.</li>
            <li className="flex gap-2.5"><span className="text-brand-500">●</span> Bạn có thể qua lại giữa các câu và nộp bài bất cứ lúc nào.</li>
          </ul>
          <button
            onClick={handleBegin}
            className="mt-7 w-full rounded-2xl bg-brand-600 py-3.5 text-base font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
          >
            Bắt đầu làm bài
          </button>
          <button onClick={() => navigate('/')} className="mt-3 text-xs font-semibold text-ink-400 hover:text-ink-600">
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        {/* top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink-600 shadow-soft">
              ⏱ {formatTime(elapsed)}
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink-600 shadow-soft">
              Đã làm {answeredCount}/{questions.length}
            </span>
          </div>
          <span
            className={cx(
              'rounded-full px-3 py-1.5 text-xs font-bold shadow-soft',
              violationCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-white text-ink-400',
            )}
            title="Số lần rời khỏi màn hình thi"
          >
            ⚠ Vi phạm: {violationCount}
          </span>
        </div>

        {toast && (
          <div className="animate-fade-in-up mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            ⚠ Đã ghi nhận vi phạm: {toast}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto]">
          {/* question card */}
          <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-card sm:p-8">
            <ProgressBar value={(current + 1) / questions.length} />
            <p className="mt-4 text-xs font-bold text-ink-400">
              Câu {current + 1}/{questions.length} · {q.chapter}
            </p>
            <p className="mt-2 text-lg leading-snug font-bold text-ink-900">{q.question}</p>

            <div className="mt-5 flex flex-col gap-3">
              {LETTERS.map((letter) => (
                <OptionButton
                  key={letter}
                  letter={letter}
                  text={q.options[letter]}
                  state={answers[q.id]?.selected === letter ? 'selected' : 'default'}
                  onClick={() => selectAnswer(q.id, letter)}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                className="rounded-2xl px-5 py-3 text-sm font-bold text-ink-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Câu trước
              </button>
              {current < questions.length - 1 ? (
                <button
                  onClick={() => goTo(current + 1)}
                  className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
                >
                  Câu tiếp theo →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-emerald-600"
                >
                  Nộp bài
                </button>
              )}
            </div>
          </div>

          {/* palette */}
          <div className="h-fit rounded-3xl border border-white bg-white/90 p-5 shadow-card lg:w-56">
            <p className="text-xs font-bold text-ink-400">Danh sách câu hỏi</p>
            <div className="mt-3 grid grid-cols-6 gap-2 lg:grid-cols-5">
              {questions.map((qq, i) => {
                const done = !!answers[qq.id]
                const isCurrent = i === current
                return (
                  <button
                    key={qq.id}
                    onClick={() => goTo(i)}
                    className={cx(
                      'flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-colors',
                      isCurrent
                        ? 'bg-brand-600 text-white'
                        : done
                          ? 'bg-brand-100 text-brand-600'
                          : 'bg-slate-100 text-ink-400 hover:bg-slate-200',
                    )}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <button
              onClick={handleSubmit}
              className="mt-5 w-full rounded-2xl bg-ink-900 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Nộp bài
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
