import { useEffect, useRef, useState } from 'react'

interface ViolationEvent {
  id: number
  reason: string
  at: number
}

interface UseAntiCheatOptions {
  active: boolean
  onViolation?: (reason: string) => void
}

/**
 * Tracks fullscreen exits and tab/window visibility changes while `active`.
 * Debounced so a single "leave" only counts once even if multiple browser
 * events fire together (blur + visibilitychange + fullscreenchange).
 */
export function useAntiCheat({ active, onViolation }: UseAntiCheatOptions) {
  const [violationCount, setViolationCount] = useState(0)
  const [lastEvent, setLastEvent] = useState<ViolationEvent | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(() => !!document.fullscreenElement)
  const cooldownRef = useRef(false)
  const idRef = useRef(0)

  const report = (reason: string) => {
    if (cooldownRef.current) return
    cooldownRef.current = true
    setTimeout(() => {
      cooldownRef.current = false
    }, 800)
    idRef.current += 1
    const evt = { id: idRef.current, reason, at: Date.now() }
    setLastEvent(evt)
    setViolationCount((c) => c + 1)
    onViolation?.(reason)
  }

  useEffect(() => {
    if (!active) return

    const onVisibility = () => {
      if (document.hidden) report('Chuyển sang tab/ứng dụng khác')
    }
    const onBlur = () => {
      if (document.hidden) return
      report('Cửa sổ mất tiêu điểm (Alt+Tab hoặc thu nhỏ)')
    }
    const onFullscreenChange = () => {
      const fs = !!document.fullscreenElement
      setIsFullscreen(fs)
      if (!fs) report('Thoát chế độ toàn màn hình')
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return
      const blocked =
        (e.altKey && e.key.toLowerCase() === 'tab') ||
        (e.metaKey && e.key.toLowerCase() === 'tab') ||
        (e.ctrlKey && (e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'n' || e.key.toLowerCase() === 'w'))
      if (blocked) {
        e.preventDefault()
      }
    }
    const onContextMenu = (e: MouseEvent) => e.preventDefault()

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('contextmenu', onContextMenu)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('contextmenu', onContextMenu)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      }
      setIsFullscreen(true)
    } catch {
      // fullscreen may be denied by the browser/user — exam still proceeds, just unmonitored for that check
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch {
      /* noop */
    }
  }

  return { violationCount, lastEvent, isFullscreen, enterFullscreen, exitFullscreen }
}
