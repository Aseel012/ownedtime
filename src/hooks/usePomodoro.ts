import { useCallback, useEffect, useRef, useState } from "react"
import { useApp } from "@/store/AppContext"
import { todayKey } from "@/lib/format"

export type PomodoroMode = "focus" | "short-break" | "long-break"

export function usePomodoro() {
  const { settings, addSession } = useApp()
  const durations: Record<PomodoroMode, number> = {
    focus: settings.pomodoroDefault,
    "short-break": settings.shortBreak,
    "long-break": settings.longBreak,
  }

  const [mode, setModeState] = useState<PomodoroMode>("focus")
  const [secondsLeft, setSecondsLeft] = useState(durations.focus * 60)
  const [running, setRunning] = useState(false)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)
  const startedAtRef = useRef<number | null>(null)

  // Reset seconds when mode or its configured duration changes (while not running)
  useEffect(() => {
    if (!running) setSecondsLeft(durations[mode] * 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, settings.pomodoroDefault, settings.shortBreak, settings.longBreak])

  const finish = useCallback(
    (completed: boolean) => {
      const elapsedMin = durations[mode] - Math.max(secondsLeft, 0) / 60
      addSession({
        date: todayKey(),
        startedAt: startedAtRef.current ?? Date.now(),
        durationMin: completed ? durations[mode] : Math.max(1, Math.round(elapsedMin)),
        type: mode,
        completed,
      })
      startedAtRef.current = null
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, secondsLeft]
  )

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          setRunning(false)
          finish(true)
          if (mode === "focus") {
            setCyclesCompleted((c) => c + 1)
          }
          // auto-advance mode
          setTimeout(() => {
            if (mode === "focus") {
              setModeState((prevMode) => prevMode) // no-op, handled below via cyclesCompleted effect
            }
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const start = () => {
    if (!running) {
      startedAtRef.current = Date.now()
      setRunning(true)
    }
  }

  const pause = () => {
    if (running && secondsLeft > 0 && secondsLeft < durations[mode] * 60) {
      finish(false)
    }
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setSecondsLeft(durations[mode] * 60)
    startedAtRef.current = null
  }

  const setMode = (m: PomodoroMode) => {
    setRunning(false)
    setModeState(m)
    setSecondsLeft(durations[m] * 60)
    startedAtRef.current = null
  }

  const totalSeconds = durations[mode] * 60
  const progress = totalSeconds === 0 ? 0 : ((totalSeconds - secondsLeft) / totalSeconds) * 100

  return {
    mode,
    setMode,
    secondsLeft,
    totalSeconds,
    running,
    start,
    pause,
    reset,
    progress,
    cyclesCompleted,
  }
}
