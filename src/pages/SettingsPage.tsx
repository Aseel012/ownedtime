import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Flag } from "@/components/Flag"
import { useApp, ACCENTS, type Appearance } from "@/store/AppContext"
import { useClock } from "@/hooks/useClock"
import { CITIES, findCity } from "@/lib/cities"
import { formatTime, formatDateLong } from "@/lib/format"

const APPEARANCES: { id: Appearance; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
]

export default function SettingsPage() {
  const { settings, setSettings, setHomeCity } = useApp()
  const now = useClock()
  const home = findCity(settings.homeCityId)

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card className="animate-fade-up p-5 md:p-6">
          <h2 className="mb-1 text-sm font-semibold">Home Time Zone</h2>
          <p className="mb-4 text-xs text-[var(--color-muted)]">
            Used for the big clock on your dashboard and today's date.
          </p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setHomeCity(c.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  settings.homeCityId === c.id
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "bg-[var(--color-paper-2)] hover:bg-[var(--color-line)]"
                }`}
              >
                <Flag code={c.code} className="h-3 w-4" />
                {c.name}
              </button>
            ))}
          </div>
        </Card>

        <Card className="animate-fade-up p-5 md:p-6" style={{ animationDelay: "20ms" }}>
          <h2 className="mb-4 text-sm font-semibold">Appearance</h2>
          <div className="flex overflow-hidden rounded-full border border-[var(--color-line)] text-sm font-medium w-fit">
            {APPEARANCES.map((a) => (
              <button
                key={a.id}
                onClick={() => setSettings((s) => ({ ...s, appearance: a.id }))}
                className={`px-4 py-2 transition-colors ${
                  settings.appearance === a.id ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "hover:bg-[var(--color-paper-2)]"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="animate-fade-up p-5 md:p-6" style={{ animationDelay: "40ms" }}>
          <h2 className="mb-4 text-sm font-semibold">Accent Color</h2>
          <div className="flex flex-wrap gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setSettings((s) => ({ ...s, accent: a.id }))}
                className="relative h-9 w-9 rounded-full ring-offset-2 ring-offset-[var(--color-card)] transition-all"
                style={{
                  backgroundColor: a.value,
                  boxShadow: settings.accent === a.id ? `0 0 0 2px ${a.value}` : "none",
                }}
                aria-label={a.id}
              />
            ))}
          </div>
        </Card>

        <Card className="animate-fade-up p-5 md:p-6" style={{ animationDelay: "80ms" }}>
          <h2 className="mb-4 text-sm font-semibold">Time Format</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">24-hour clock</p>
              <p className="text-xs text-[var(--color-muted)]">Show time as 08:15 instead of 8:15 AM</p>
            </div>
            <Switch
              checked={settings.timeFormat === "24h"}
              onCheckedChange={(v) => setSettings((s) => ({ ...s, timeFormat: v ? "24h" : "12h" }))}
            />
          </div>
        </Card>

        <Card className="animate-fade-up p-5 md:p-6" style={{ animationDelay: "120ms" }}>
          <h2 className="mb-4 text-sm font-semibold">Pomodoro Durations (minutes)</h2>
          <div className="flex flex-col gap-4">
            <DurationRow
              label="Pomodoro Default"
              value={settings.pomodoroDefault}
              onChange={(v) => setSettings((s) => ({ ...s, pomodoroDefault: v }))}
              max={90}
            />
            <DurationRow
              label="Short Break"
              value={settings.shortBreak}
              onChange={(v) => setSettings((s) => ({ ...s, shortBreak: v }))}
              max={30}
            />
            <DurationRow
              label="Long Break"
              value={settings.longBreak}
              onChange={(v) => setSettings((s) => ({ ...s, longBreak: v }))}
              max={60}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="animate-fade-up p-5 md:p-6">
          <p className="mb-3 text-xs font-medium text-[var(--color-muted)]">Preview</p>
          <p className="tabular text-3xl font-bold">{formatTime(now, settings.timeFormat, home?.timeZone)}</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {home ? `${home.name}, ${home.country}` : "—"}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">{formatDateLong(now, home?.timeZone)}</p>
        </Card>

        <Card className="animate-fade-up p-5 md:p-6 text-xs text-[var(--color-muted)]" style={{ animationDelay: "40ms" }}>
          <p className="mb-1 font-semibold text-[var(--color-ink)]">About NoTime</p>
          <p>Version 1.0.0</p>
          <p className="mt-2 leading-relaxed">
            A distraction-free clock, Pomodoro timer, and productivity hub — all in one place.
          </p>
        </Card>
      </div>
    </div>
  )
}

function DurationRow({
  label,
  value,
  onChange,
  max,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  max: number
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-[var(--color-paper-2)] accent-[var(--color-ember)]"
        />
        <span className="tabular w-14 text-right text-sm font-semibold">{value} min</span>
      </div>
    </div>
  )
}
