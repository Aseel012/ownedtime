import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/store/AppContext"
import { formatDuration } from "@/lib/format"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function toKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function CalendarPage() {
  const { sessions, tasks } = useApp()
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(toKey(today))

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, typeof sessions>()
    sessions.forEach((s) => {
      const arr = map.get(s.date) ?? []
      arr.push(s)
      map.set(s.date, arr)
    })
    return map
  }, [sessions])

  const cells = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstDay = new Date(year, month, 1)
    const offset = (firstDay.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const result: (Date | null)[] = []
    for (let i = 0; i < offset; i++) result.push(null)
    for (let d = 1; d <= daysInMonth; d++) result.push(new Date(year, month, d))
    return result
  }, [cursor])

  const selectedSessions = sessionsByDay.get(selected) ?? []
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.3fr_1fr]">
      <Card className="animate-fade-up p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">{monthLabel}</h2>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="soft" onClick={() => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(toKey(today)) }}>
              Today
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--color-muted)]">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />
            const key = toKey(d)
            const isToday = key === toKey(today)
            const isSelected = key === selected
            const daySessions = sessionsByDay.get(key)
            return (
              <button
                key={i}
                onClick={() => setSelected(key)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-[var(--color-ember)] text-white"
                    : isToday
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "hover:bg-[var(--color-paper-2)]"
                }`}
              >
                {d.getDate()}
                {daySessions && daySessions.length > 0 && !isSelected && (
                  <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[var(--color-ember)]" />
                )}
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="animate-fade-up p-5 md:p-6" style={{ animationDelay: "80ms" }}>
        <h3 className="mb-1 text-sm font-semibold">
          Focus Calendar —{" "}
          {new Date(selected).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </h3>
        <p className="mb-4 text-xs text-[var(--color-muted)]">
          {selectedSessions.length} session{selectedSessions.length === 1 ? "" : "s"} logged
        </p>
        <ul className="flex flex-col divide-y divide-[var(--color-line)]">
          {selectedSessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium capitalize">{s.type.replace("-", " ")}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {new Date(s.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <span className="tabular text-sm font-semibold">{formatDuration(s.durationMin * 60)}</span>
            </li>
          ))}
          {selectedSessions.length === 0 && (
            <li className="py-8 text-center text-sm text-[var(--color-muted)]">
              No sessions on this day yet. Start a Pomodoro to fill your calendar.
            </li>
          )}
        </ul>

        <div className="mt-6 border-t border-[var(--color-line)] pt-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Open Tasks
          </h4>
          <ul className="flex flex-col gap-1.5">
            {tasks
              .filter((t) => !t.done)
              .slice(0, 4)
              .map((t) => (
                <li key={t.id} className="text-sm">
                  • {t.title}
                </li>
              ))}
            {tasks.filter((t) => !t.done).length === 0 && (
              <li className="text-sm text-[var(--color-muted)]">All tasks complete 🎉</li>
            )}
          </ul>
        </div>
      </Card>
    </div>
  )
}
