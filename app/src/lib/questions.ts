import raw from '../data/questions.json'
import type { ChapterInfo, Question } from '../types'

export const ALL_QUESTIONS = raw as Question[]

export function getChapters(): ChapterInfo[] {
  const map = new Map<string, number>()
  for (const q of ALL_QUESTIONS) {
    map.set(q.chapter, (map.get(q.chapter) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
}

export function filterQuestions(chapters: string[] | 'all'): Question[] {
  if (chapters === 'all') return ALL_QUESTIONS
  const set = new Set(chapters)
  return ALL_QUESTIONS.filter((q) => set.has(q.chapter))
}
