import { create } from 'zustand'
import type { AnswerRecord, OptionKey, Question, QuizMode } from '../types'
import { shuffle } from './utils'

interface SessionState {
  mode: QuizMode
  questions: Question[]
  current: number
  answers: Record<number, AnswerRecord>
  revealed: Record<number, boolean>
  violations: number
  startedAt: number | null
  finishedAt: number | null

  startSession: (mode: QuizMode, questions: Question[], shuffleQuestions: boolean) => void
  selectAnswer: (questionId: number, key: OptionKey) => void
  reveal: (questionId: number) => void
  goTo: (index: number) => void
  next: () => void
  prev: () => void
  addViolation: () => void
  finish: () => void
  reset: () => void
}

export const useSession = create<SessionState>((set, get) => ({
  mode: 'practice',
  questions: [],
  current: 0,
  answers: {},
  revealed: {},
  violations: 0,
  startedAt: null,
  finishedAt: null,

  startSession: (mode, questions, shuffleQuestions) => {
    const qs = shuffleQuestions ? shuffle(questions) : questions
    set({
      mode,
      questions: qs,
      current: 0,
      answers: {},
      revealed: {},
      violations: 0,
      startedAt: Date.now(),
      finishedAt: null,
    })
  },

  selectAnswer: (questionId, key) => {
    const q = get().questions.find((q) => q.id === questionId)
    if (!q) return
    set((s) => ({
      answers: {
        ...s.answers,
        [questionId]: { questionId, selected: key, correct: key === q.answer },
      },
    }))
  },

  reveal: (questionId) => {
    set((s) => ({ revealed: { ...s.revealed, [questionId]: true } }))
  },

  goTo: (index) => {
    const len = get().questions.length
    if (index < 0 || index >= len) return
    set({ current: index })
  },

  next: () => {
    const { current, questions } = get()
    if (current < questions.length - 1) set({ current: current + 1 })
  },

  prev: () => {
    const { current } = get()
    if (current > 0) set({ current: current - 1 })
  },

  addViolation: () => set((s) => ({ violations: s.violations + 1 })),

  finish: () => set({ finishedAt: Date.now() }),

  reset: () =>
    set({
      mode: 'practice',
      questions: [],
      current: 0,
      answers: {},
      revealed: {},
      violations: 0,
      startedAt: null,
      finishedAt: null,
    }),
}))
