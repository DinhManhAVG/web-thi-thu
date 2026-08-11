export type OptionKey = 'A' | 'B' | 'C' | 'D'

export interface Question {
  id: number
  chapter: string
  question: string
  options: Record<OptionKey, string>
  answer: OptionKey
  explanation: string
}

export interface ChapterInfo {
  name: string
  count: number
}

export type QuizMode = 'practice' | 'exam'

export interface AnswerRecord {
  questionId: number
  selected: OptionKey | null
  correct: boolean
}

export interface ExamConfig {
  mode: QuizMode
  chapters: string[] | 'all'
  count: number
  shuffle: boolean
}
