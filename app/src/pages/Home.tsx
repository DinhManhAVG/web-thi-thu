import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { getChapters, filterQuestions } from '../lib/questions'
import { useSession } from '../lib/store'
import { shuffle } from '../lib/utils'
import type { QuizMode } from '../types'
import { cx } from '../lib/utils'

const COUNT_OPTIONS = [10, 20, 30, 50]

export default function Home() {
  const navigate = useNavigate()
  const chapters = useMemo(() => getChapters(), [])
  const totalAll = useMemo(() => chapters.reduce((a, c) => a + c.count, 0), [chapters])

  const [mode, setMode] = useState<QuizMode>('practice')
  const [selectedChapters, setSelectedChapters] = useState<string[] | 'all'>('all')
  const [countMode, setCountMode] = useState<number | 'all'>(20)
  const startSession = useSession((s) => s.startSession)

  const pool = useMemo(() => filterQuestions(selectedChapters), [selectedChapters])
  const maxCount = pool.length

  function toggleChapter(name: string) {
    setSelectedChapters((prev) => {
      if (prev === 'all') return [name]
      if (prev.includes(name)) {
        const next = prev.filter((c) => c !== name)
        return next.length ? next : 'all'
      }
      return [...prev, name]
    })
  }

  function handleStart() {
    let selected = shuffle(pool)
    if (countMode !== 'all') selected = selected.slice(0, Math.min(countMode, selected.length))
    if (!selected.length) return
    startSession(mode, selected, false)
    navigate(mode === 'practice' ? '/quiz' : '/exam')
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-fuchsia-400 text-2xl font-black text-white shadow-soft">
            HCM
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-ink-900">Trắc nghiệm Tư tưởng Hồ Chí Minh</h1>
          <p className="mt-2 text-sm text-ink-400">
            Ngân hàng {totalAll} câu hỏi trắc nghiệm — ôn tập từng chương hoặc làm bài thi thử có giám sát.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-white bg-white/90 p-6 shadow-card sm:p-8">
          {/* Mode */}
          <p className="text-sm font-bold text-ink-900">Chế độ</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ModeCard
              active={mode === 'practice'}
              title="Ôn tập"
              desc="Xem đáp án & giải thích ngay sau mỗi câu."
              onClick={() => setMode('practice')}
            />
            <ModeCard
              active={mode === 'exam'}
              title="Thi thử"
              desc="Toàn màn hình, tính giờ, nộp bài mới xem kết quả."
              onClick={() => setMode('exam')}
            />
          </div>

          {/* Chapters */}
          <p className="mt-7 text-sm font-bold text-ink-900">Phạm vi câu hỏi</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip active={selectedChapters === 'all'} onClick={() => setSelectedChapters('all')}>
              Tất cả ({totalAll})
            </Chip>
            {chapters.map((c) => (
              <Chip
                key={c.name}
                active={selectedChapters !== 'all' && selectedChapters.includes(c.name)}
                onClick={() => toggleChapter(c.name)}
              >
                {c.name} ({c.count})
              </Chip>
            ))}
          </div>

          {/* Count */}
          <p className="mt-7 text-sm font-bold text-ink-900">Số lượng câu hỏi</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {COUNT_OPTIONS.map((n) => (
              <Chip key={n} active={countMode === n} onClick={() => setCountMode(n)} disabled={n > maxCount}>
                {n} câu
              </Chip>
            ))}
            <Chip active={countMode === 'all'} onClick={() => setCountMode('all')}>
              Tất cả ({maxCount})
            </Chip>
          </div>

          <button
            onClick={handleStart}
            disabled={maxCount === 0}
            className="mt-8 w-full rounded-2xl bg-brand-600 py-4 text-center text-base font-bold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {mode === 'practice' ? 'Bắt đầu ôn tập' : 'Bắt đầu thi thử →'}
          </button>
          {mode === 'exam' && (
            <p className="mt-3 text-center text-xs text-ink-400">
              Bài thi sẽ chuyển sang chế độ toàn màn hình và ghi nhận số lần bạn rời khỏi màn hình thi.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ModeCard({ active, title, desc, onClick }: { active: boolean; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'rounded-2xl border-2 p-4 text-left transition-all',
        active ? 'border-brand-500 bg-brand-50 shadow-soft' : 'border-slate-200 bg-white hover:border-brand-200',
      )}
    >
      <p className={cx('text-[15px] font-bold', active ? 'text-brand-700' : 'text-ink-900')}>{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-400">{desc}</p>
    </button>
  )
}

function Chip({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
        disabled && 'cursor-not-allowed opacity-40',
        active
          ? 'border-brand-500 bg-brand-600 text-white'
          : 'border-slate-200 bg-white text-ink-600 hover:border-brand-300',
      )}
    >
      {children}
    </button>
  )
}
