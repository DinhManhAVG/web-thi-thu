import type { ReactNode } from 'react'

export default function QuizCard({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-card backdrop-blur-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
