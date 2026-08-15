import { useMemo, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from "recharts"
import { Card } from "@/components/ui/card"
import { useApp } from "@/store/AppContext"
import { formatDuration } from "@/lib/format"

type View = "daily" | "weekly" | "monthly"

function dayLabel(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short" })
}

export default function StatsPage() {
  const { sessions } = useApp()
  const [view, setView] = useState<View>("weekly")

  const chartData = useMemo(() => {
    const focus = sessions.filter((s) => s.completed && s.type === "focus")
    const days = view === "daily" ? 7 : view === "weekly" ? 7 : 30
    const buckets: { key: string; label: string; minutes: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      buckets.push({ key, label: days > 10 ? String(d.getDate()) : dayLabel(d), minutes: 0 })
    }
    const byKey = new Map(buckets.map((b) => [b.key, b]))
    focus.forEach((s) => {
      const b = byKey.get(s.date)
      if (b) b.minutes += s.durationMin
    })
    return buckets
  }, [sessions, view])

  const totals = useMemo(() => {
    const focus = sessions.filter((s) => s.completed && s.type === "focus")
    const totalMin = focus.reduce((acc, s) => acc + s.durationMin, 0)
    const totalSessions = focus.length

    const days = new Set(focus.map((s) => s.date))
    let streak = 0
    const cursor = new Date()
    while (days.has(cursor.toISOString().slice(0, 10))) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
    return { totalMin, totalSessions, streak }
  }, [sessions])

  const busiestDay = useMemo(() => {
    if (chartData.length === 0) return "—"
    const max = chartData.reduce((a, b) => (b.minutes > a.minutes ? b : a), chartData[0])
    return max.minutes > 0 ? max.label : "—"
  }, [chartData])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Card className="animate-fade-up p-5 md:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Pomodoro Stats</h2>
            <p className="text-sm text-[var(--color-muted)]">
              {formatDuration(chartData.reduce((a, b) => a + b.minutes, 0) * 60)} focused recently
            </p>
          </div>
          <div className="flex overflow-hidden rounded-full border border-[var(--color-line)] text-xs font-semibold">
            {(["daily", "weekly", "monthly"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3.5 py-1.5 capitalize transition-colors ${
                  view === v ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "hover:bg-[var(--color-paper-2)]"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap={view === "monthly" ? "20%" : "35%"}>
              <CartesianGrid vertical={false} stroke="var(--color-line)" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                interval={view === "monthly" ? 4 : 0}
              />
              <Tooltip
                cursor={{ fill: "var(--color-paper-2)" }}
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v) => [`${v} min`, "Focus time"]}
              />
              <Bar dataKey="minutes" radius={[6, 6, 6, 6]} maxBarSize={28} fill="var(--color-ember)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--color-line)] pt-5 sm:grid-cols-4">
          <Stat label="Total Focus Time" value={formatDuration(totals.totalMin * 60)} />
          <Stat label="Total Sessions" value={String(totals.totalSessions)} />
          <Stat label="Current Streak" value={`${totals.streak} Day${totals.streak === 1 ? "" : "s"}`} />
          <Stat label="Busiest Day" value={busiestDay} />
        </div>
      </Card>
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
