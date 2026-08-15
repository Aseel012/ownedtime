import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Plus, ChevronRight, Play, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag } from "@/components/Flag"
import { WorldMap } from "@/components/WorldMap"
import { useApp } from "@/store/AppContext"
import { useClock } from "@/hooks/useClock"
import { CITIES, findCity } from "@/lib/cities"
import { formatDateLong, formatShortTime, formatDuration, todayKey, getUtcOffsetLabel, isDaytime } from "@/lib/format"

function useDigits(now: Date, timeFormat: "12h" | "24h") {
  const h24 = now.getHours()
  const h = timeFormat === "12h" ? ((h24 % 12) || 12) : h24
  const m = now.getMinutes()
  const s = now.getSeconds()
  return {
    h: h.toString().padStart(2, "0"),
    m: m.toString().padStart(2, "0"),
    s: s.toString().padStart(2, "0"),
    suffix: timeFormat === "12h" ? (h24 >= 12 ? "PM" : "AM") : "",
  }
}

export default function ClockPage() {
  const { settings, setSettings, setHomeCity, sessions, tasks } = useApp()
  const now = useClock()
  const digits = useDigits(now, settings.timeFormat)
  const home = findCity(settings.homeCityId) ?? CITIES[0]

  const otherCities = useMemo(
    () => settings.watchedCityIds.filter((id) => id !== home.id).slice(0, 3),
    [settings.watchedCityIds, home.id]
  )

  const todaysSessions = sessions.filter((s) => s.date === todayKey() && s.completed)
  const focusSecondsToday = todaysSessions
    .filter((s) => s.type === "focus")
    .reduce((acc, s) => acc + s.durationMin * 60, 0)
  const sessionsToday = todaysSessions.length
  const tasksDone = tasks.filter((t) => t.done).length

  const streak = useMemo(() => {
    const days = new Set(sessions.filter((s) => s.completed && s.type === "focus").map((s) => s.date))
    let count = 0
    const cursor = new Date()
    while (true) {
      const key = cursor.toISOString().slice(0, 10)
      if (days.has(key)) {
        count++
        cursor.setDate(cursor.getDate() - 1)
      } else break
    }
    return count
  }, [sessions])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Big clock */}
      <Card className="animate-fade-up p-6 md:p-10">
        <div className="tabular flex items-baseline justify-center gap-1 whitespace-nowrap text-[clamp(2.75rem,9vw,6.5rem)] font-bold leading-none tracking-tight">
          <span>{digits.h}</span>
          <span className="animate-tick text-[var(--color-ember)]">:</span>
          <span>{digits.m}</span>
          <span className="animate-tick text-[var(--color-ember)]">:</span>
          <span>{digits.s}</span>
          {digits.suffix && <span className="ml-2 text-[clamp(1rem,2.5vw,1.75rem)] font-medium text-[var(--color-muted)]">{digits.suffix}</span>}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
          <span>Current Time</span>
          <span className="font-medium text-[var(--color-ink)]">{formatDateLong(now, home.timeZone)}</span>
          <Link to="/world-clock" className="flex items-center gap-1 font-medium text-[var(--color-ink)] hover:text-[var(--color-ember)]">
            {home.name}, {home.country} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <div className="flex items-center gap-2">
            <label className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
              <select
                value={settings.homeCityId}
                onChange={(e) => setHomeCity(e.target.value)}
                className="cursor-pointer appearance-none rounded-full border border-[var(--color-line)] bg-[var(--color-card)] py-1.5 pl-8 pr-3 text-xs font-semibold text-[var(--color-ink)] outline-none transition-colors hover:bg-[var(--color-paper-2)] focus-visible:ring-2 focus-visible:ring-[var(--color-ember)]"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.country}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex overflow-hidden rounded-full border border-[var(--color-line)] text-xs font-semibold">
              <button
                onClick={() => setSettings((s) => ({ ...s, timeFormat: "12h" }))}
                className={`px-3 py-1.5 transition-colors ${settings.timeFormat === "12h" ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "hover:bg-[var(--color-paper-2)]"}`}
              >
                12h
              </button>
              <button
                onClick={() => setSettings((s) => ({ ...s, timeFormat: "24h" }))}
                className={`px-3 py-1.5 transition-colors ${settings.timeFormat === "24h" ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "hover:bg-[var(--color-paper-2)]"}`}
              >
                24h
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Cities row */}
        <Card className="animate-fade-up relative overflow-hidden p-6" style={{ animationDelay: "60ms" }}>
          <WorldMap className="opacity-40" dotClassName="fill-[var(--color-line)]" />
          <div className="relative mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {home.name},<br />{home.country}
              </h2>
            </div>
            <p className="max-w-[220px] text-right text-sm text-[var(--color-muted)]">
              Life moves fast. Stay on time and enjoy every moment!
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[home.id, ...otherCities].map((id, i) => {
              const c = findCity(id)
              if (!c) return null
              const active = i === 0
              return (
                <button
                  key={c.id}
                  onClick={() => setHomeCity(c.id)}
                  title={active ? "Home time zone" : `Set ${c.name} as home`}
                  className={`flex flex-col justify-between rounded-2xl p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                    active ? "bg-[var(--color-ink)] text-[var(--color-paper)] shadow-md" : "bg-[var(--color-paper-2)] hover:bg-[var(--color-line)]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex min-w-0 items-center gap-1.5 font-medium">
                      <Flag code={c.code} className="h-3 w-4 shrink-0" />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className={`shrink-0 whitespace-nowrap pl-1 ${active ? "text-[var(--color-paper)]/60" : "text-[var(--color-muted)]"}`}>
                      {getUtcOffsetLabel(c.timeZone, now)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <span className="tabular text-xl font-bold">{formatShortTime(now, settings.timeFormat, c.timeZone)}</span>
                    <span className={`text-[10px] ${active ? "text-[var(--color-paper)]/70" : "text-[var(--color-muted)]"}`}>
                      {isDaytime(c.timeZone, now) ? "☀ Day" : "🌙 Night"}
                    </span>
                  </div>
                </button>
              )
            })}
            <Link
              to="/world-clock"
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[var(--color-line)] p-3.5 text-xs font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-ember)] hover:text-[var(--color-ember)]"
            >
              <Plus className="h-4 w-4" />
              Add City
            </Link>
          </div>
        </Card>

        {/* Pomodoro + today stats */}
        <div className="flex animate-fade-up flex-col gap-6" style={{ animationDelay: "100ms" }}>
          <Card className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-ember-soft)] text-xl">
                🍅
              </div>
              <div>
                <p className="text-xs text-[var(--color-muted)]">Pomodoro</p>
                <p className="text-xs text-[var(--color-muted)]">Ready to focus?</p>
                <p className="tabular text-2xl font-bold">{settings.pomodoroDefault}:00</p>
              </div>
            </div>
            <Button asChild size="sm">
              <Link to="/pomodoro">
                <Play className="h-3.5 w-3.5 fill-current" /> Start
              </Link>
            </Button>
          </Card>

          <Card className="p-5">
            <p className="mb-4 text-xs font-medium text-[var(--color-muted)]">Today</p>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Focus Time" value={formatDuration(focusSecondsToday)} />
              <Stat label="Sessions" value={String(sessionsToday)} />
              <Stat label="Tasks Done" value={`${tasksDone}/${tasks.length}`} />
              <Stat label="Longest Streak" value={`${streak} Day${streak === 1 ? "" : "s"}`} />
            </div>
          </Card>

          <Card className="p-5 text-sm italic leading-relaxed text-[var(--color-muted)]">
            "Discipline is choosing between what you want now and what you want most."
            <footer className="mt-2 text-xs font-medium not-italic text-[var(--color-ink)]">— Abraham Lincoln</footer>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="tabular text-xl font-bold">{value}</p>
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
    </div>
  )
}
