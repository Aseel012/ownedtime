import { useMemo } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from "recharts"
import { TrendingUp, Flame, CheckCircle2, Clock3 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WorldMap } from "@/components/WorldMap"
import { useApp } from "@/store/AppContext"
import { formatDuration } from "@/lib/format"

export default function InsightsPage() {
  const { sessions, tasks } = useApp()

  const trend = useMemo(() => {
    const focus = sessions.filter((s) => s.completed && s.type === "focus")
    const buckets: { key: string; label: string; minutes: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      buckets.push({ key: d.toISOString().slice(0, 10), label: `${d.getMonth() + 1}/${d.getDate()}`, minutes: 0 })
    }
    const map = new Map(buckets.map((b) => [b.key, b]))
    focus.forEach((s) => {
      const b = map.get(s.date)
      if (b) b.minutes += s.durationMin
    })
    return buckets
  }, [sessions])

  const completionRate = tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0

  const avgSessionLen = useMemo(() => {
    const focus = sessions.filter((s) => s.completed && s.type === "focus")
    if (focus.length === 0) return 0
    return Math.round(focus.reduce((a, s) => a + s.durationMin, 0) / focus.length)
  }, [sessions])

  const bestStreak = useMemo(() => {
    const days = new Set(sessions.filter((s) => s.completed && s.type === "focus").map((s) => s.date))
    const sorted = Array.from(days).sort()
    let best = 0
    let current = 0
    let prev: Date | null = null
    sorted.forEach((key) => {
      const d = new Date(key)
      if (prev && (d.getTime() - prev.getTime()) / 86400000 === 1) {
        current++
      } else {
        current = 1
      }
      best = Math.max(best, current)
      prev = d
    })
    return best
  }, [sessions])

  const totalFocusAllTime = sessions.filter((s) => s.completed && s.type === "focus").reduce((a, s) => a + s.durationMin, 0)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Card className="animate-fade-up relative overflow-hidden p-5 md:p-6">
        <WorldMap className="opacity-[0.35]" dotClassName="fill-[var(--color-line)]" />
        <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4">
          <InsightStat icon={Clock3} label="Total Focus Time" value={formatDuration(totalFocusAllTime * 60)} />
          <InsightStat icon={CheckCircle2} label="Task Completion" value={`${completionRate}%`} />
          <InsightStat icon={Flame} label="Best Streak" value={`${bestStreak} Day${bestStreak === 1 ? "" : "s"}`} />
          <InsightStat icon={TrendingUp} label="Avg. Session" value={`${avgSessionLen} min`} />
        </div>
      </Card>

      <Card className="animate-fade-up p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Focus Trend</h2>
            <p className="text-sm text-[var(--color-muted)]">Last 14 days of focused minutes</p>
          </div>
          <Badge variant="soft">14 days</Badge>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-ember)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-ember)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-line)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted)", fontSize: 10 }} interval={2} />
              <Tooltip
                contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-line)", borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [`${v} min`, "Focus"]}
              />
              <Area type="monotone" dataKey="minutes" stroke="var(--color-ember)" strokeWidth={2.5} fill="url(#focusGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="animate-fade-up p-5 md:p-6" style={{ animationDelay: "80ms" }}>
        <h3 className="mb-3 text-sm font-semibold">What this means</h3>
        <ul className="flex flex-col gap-2.5 text-sm text-[var(--color-muted)]">
          <li>
            • You've logged <span className="font-semibold text-[var(--color-ink)]">{formatDuration(totalFocusAllTime * 60)}</span> of
            focused work across {sessions.filter((s) => s.completed && s.type === "focus").length} sessions.
          </li>
          <li>
            • Your average focus session runs <span className="font-semibold text-[var(--color-ink)]">{avgSessionLen} minutes</span>
            {avgSessionLen >= 20 ? " — right in the sweet spot for deep work." : " — try stretching sessions closer to 25 minutes."}
          </li>
          <li>
            • Task completion sits at <span className="font-semibold text-[var(--color-ink)]">{completionRate}%</span>
            {completionRate >= 70 ? ", nice follow-through." : ", clearing a few small tasks could help build momentum."}
          </li>
          <li>
            • Longest daily streak so far: <span className="font-semibold text-[var(--color-ink)]">{bestStreak} day{bestStreak === 1 ? "" : "s"}</span> in a row.
          </li>
        </ul>
      </Card>
    </div>
  )
}

function InsightStat({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-paper-2)]/70 p-4 backdrop-blur-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ember-soft)] text-[var(--color-ember)]">
        <Icon className="h-4 w-4" />
      </div>
      <p className="tabular text-xl font-bold">{value}</p>
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
    </div>
  )
}
