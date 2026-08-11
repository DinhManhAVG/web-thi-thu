import { useEffect, useRef, type ReactNode } from 'react'
import { cx } from '../lib/utils'

export type DialogVariant = 'warning' | 'danger' | 'info'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: DialogVariant
  onConfirm: () => void
  onCancel: () => void
}

const variantStyles: Record<DialogVariant, { icon: string; iconBg: string; iconColor: string; confirmBtn: string }> = {
  warning: {
    icon: '⚠',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-500',
    confirmBtn: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400',
  },
  danger: {
    icon: '🗑',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    confirmBtn: 'bg-red-500 hover:bg-red-600 focus-visible:ring-red-400',
  },
  info: {
    icon: '📋',
    iconBg: 'bg-brand-100',
    iconColor: 'text-brand-600',
    confirmBtn: 'bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-400',
  },
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Huỷ',
  variant = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)
  const style = variantStyles[variant]

  // Auto-focus confirm button when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => confirmRef.current?.focus(), 50)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div
        className="animate-fade-in absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Card */}
      <div className="animate-dialog-in relative w-full max-w-sm rounded-3xl border border-white/60 bg-white p-6 shadow-[0_24px_64px_-12px_rgba(26,21,51,0.35)]">
        {/* Icon */}
        <div className={cx('mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl', style.iconBg, style.iconColor)}>
          {style.icon}
        </div>

        {/* Title */}
        <h2 id="dialog-title" className="mt-4 text-center text-[17px] font-extrabold text-ink-900">
          {title}
        </h2>

        {/* Message */}
        <p className="mt-2 text-center text-sm leading-relaxed text-ink-400">
          {message}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={cx(
              'flex-1 rounded-2xl py-3 text-sm font-bold text-white shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              style.confirmBtn,
            )}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-slate-100 py-3 text-sm font-bold text-ink-600 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
