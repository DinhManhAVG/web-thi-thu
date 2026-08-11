interface ProgressBarProps {
  value: number // 0..1
}

export default function ProgressBar({ value }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-100/80">
      <div
        className="h-full rounded-full bg-linear-to-r from-brand-500 via-brand-500 to-fuchsia-400 transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
