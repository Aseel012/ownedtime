import { useState } from "react"
import { Play, Pause, RotateCcw, Plus, MoreHorizontal, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { usePomodoro, type PomodoroMode } from "@/hooks/usePomodoro"
import { useApp } from "@/store/AppContext"
import { pad2, todayKey } from "@/lib/format"

const MODES: { id: PomodoroMode; label: string }[] = [
  { id: "focus", label: "Focus" },
  { id: "short-break", label: "Short Break" },
  { id: "long-break", label: "Long Break" },
]

const DAILY_GOAL = 8

export default function PomodoroPage() {
  const { mode, setMode, secondsLeft, totalSeconds, running, start, pause, reset, progress } = usePomodoro()
  const { tasks, addTask, toggleTask, removeTask, sessions } = useApp()
  const [draft, setDraft] = useState("")

  const min = Math.floor(secondsLeft / 60)
  const sec = secondsLeft % 60

  const circumference = 2 * Math.PI * 120
  const dashOffset = circumference * (1 - progress / 100)

  const sessionsCompletedToday = sessions.filter(
    (s) => s.date === todayKey() && s.completed && s.type === "focus"
  ).length

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="animate-fade-up flex flex-col items-center p-6 md:p-10">
        <div className="mb-6 w-full">
          <h2 className="text-xl font-bold tracking-tight">Pomodoro Timer</h2>
          <p className="text-sm text-[var(--color-muted)]">Focus on what matters.</p>
        </div>

        <div className="mb-6 flex overflow-hidden rounded-full border border-[var(--color-line)] text-xs font-semibold">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-2 transition-colors ${
                mode === m.id ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "hover:bg-[var(--color-paper-2)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
          <svg viewBox="0 0 260 260" className="absolute inset-0 -rotate-90">
            <circle cx="130" cy="130" r="120" fill="none" stroke="var(--color-paper-2)" strokeWidth="10" />
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="var(--color-ember)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className={`mb-2 text-3xl ${running ? "animate-pulse" : ""}`}>🍅</span>
            <span className="tabular text-[clamp(2.5rem,7vw,3.75rem)] font-bold leading-none">
              {pad2(min)}:{pad2(sec)}
            </span>
            <span className="mt-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              {mode === "focus" ? "Focus Time" : mode === "short-break" ? "Short Break" : "Long Break"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          {!running ? (
            <Button onClick={start} className={running ? "" : "animate-pulse-ring"}>
              <Play className="h-4 w-4 fill-current" /> {secondsLeft === totalSeconds ? "Start" : "Resume"}
            </Button>
          ) : (
            <Button onClick={pause} variant="ember">
              <Pause className="h-4 w-4 fill-current" /> Pause
            </Button>
          )}
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>

      <div className="flex animate-fade-up flex-col gap-6" style={{ animationDelay: "80ms" }}>
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--color-muted)]">Today's Progress</p>
            <p className="tabular text-sm font-semibold">
              {sessionsCompletedToday} / {DAILY_GOAL}
            </p>
          </div>
          <div className="flex items-end gap-1.5">
            {Array.from({ length: DAILY_GOAL }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-full transition-colors"
                style={{
                  height: 28 + (i % 3) * 6,
                  backgroundColor: i < sessionsCompletedToday ? "var(--color-ember)" : "var(--color-paper-2)",
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--color-muted)]">Sessions completed today</p>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--color-muted)]">Tasks</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              addTask(draft)
              setDraft("")
            }}
            className="mb-3 flex gap-2"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add task..."
              className="h-9"
            />
            <Button type="submit" size="icon" variant="soft" className="h-9 w-9 shrink-0 rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
          <ul className="flex flex-col divide-y divide-[var(--color-line)]">
            {tasks.slice(0, 6).map((t) => (
              <li key={t.id} className="group flex items-center gap-3 py-2.5">
                <Checkbox checked={t.done} onCheckedChange={() => toggleTask(t.id)} />
                <span className={`flex-1 text-sm ${t.done ? "text-[var(--color-muted)] line-through" : ""}`}>
                  {t.title}
                </span>
                <button
                  onClick={() => removeTask(t.id)}
                  className="rounded-full p-1 text-[var(--color-muted)] opacity-0 transition-opacity hover:text-[var(--color-ember)] group-hover:opacity-100"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="flex items-center gap-2 py-6 text-sm text-[var(--color-muted)]">
                <MoreHorizontal className="h-4 w-4" /> No tasks yet — add one above.
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  )
}
