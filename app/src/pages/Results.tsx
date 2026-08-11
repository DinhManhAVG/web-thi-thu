import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../lib/store'
import { cx } from '../lib/utils'

export default function Results() {
  const navigate = useNavigate()
  const { questions, answers, mode, violations, reset } = useSession()
  const [filter, setFilter] = useState<'all' | 'wrong'>('all')

  const stats = useMemo(() => {
    let correct = 0
    for (const q of questions) if (answers[q.id]?.correct) correct++
    const total = questions.length
    return { correct, total, pct: total ? Math.round((correct / total) * 100) : 0 }
  }, [questions, answers])

  if (!questions.length) {
    navigate('/', { replace: true })
    return null
  }

  const list = filter === 'wrong' ? questions.filter((q) => !answers[q.id]?.correct) : questions
  const grade = stats.pct >= 80 ? 'Xuất sắc!' : stats.pct >= 65 ? 'Khá tốt!' : stats.pct >= 50 ? 'Cần cố gắng thêm' : 'Nên ôn lại kỹ hơn'

  function handleRestart() {
    reset()
    navigate('/')
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-white bg-white/90 p-6 text-center shadow-card sm:p-8">
          <p className="text-sm font-bold text-brand-500 uppercase tracking-wide">Kết quả</p>
          <div className="mx-auto mt-4 flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-fuchsia-400 shadow-soft">
            <span className="text-3xl font-black text-white">{stats.pct}%</span>
          </div>
          <p className="mt-4 text-xl font-extrabold text-ink-900">{grade}</p>
          <p className="mt-1 text-sm text-ink-400">
            Đúng {stats.correct}/{stats.total} câu
          </p>

          {mode === 'exam' && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
              ⚠ {violations} lần vi phạm trong lúc thi
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 rounded-2xl bg-brand-600 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              Làm bài khác
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 rounded-2xl bg-slate-100 py-3 text-sm font-bold text-ink-600 transition-colors hover:bg-slate-200"
            >
              Về trang chủ
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-bold text-ink-900">Xem lại bài làm</p>
          <div className="flex gap-2">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
              Tất cả
            </FilterChip>
            <FilterChip active={filter === 'wrong'} onClick={() => setFilter('wrong')}>
              Câu sai
            </FilterChip>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {list.map((q, i) => {
            const record = answers[q.id]
            const correct = !!record?.correct
            return (
              <div key={q.id} className="rounded-2xl border border-white bg-white/90 p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm leading-snug font-bold text-ink-900">
                    {questions.indexOf(q) + 1}. {q.question}
                  </p>
                  <span
                    className={cx(
                      'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold',
                      correct ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500',
                    )}
                  >
                    {correct ? 'Đúng' : 'Sai'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink-400">
                  Bạn chọn:{' '}
                  <span className={cx('font-semibold', correct ? 'text-emerald-600' : 'text-red-500')}>
                    {record?.selected ? `${record.selected}. ${q.options[record.selected]}` : 'Không trả lời'}
                  </span>
                </p>
                {!correct && (
                  <p className="mt-1 text-xs font-semibold text-ink-600">
                    Đáp án đúng: <span className="text-brand-600">{q.answer}. {q.options[q.answer]}</span>
                  </p>
                )}
                {q.explanation && <p className="mt-2 text-xs leading-relaxed text-ink-400">{q.explanation}</p>}
                {i < list.length - 1 && null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
        active ? 'bg-brand-600 text-white' : 'bg-white text-ink-500 shadow-soft hover:bg-slate-50',
      )}
    >
      {children}
    </button>
  )
}
