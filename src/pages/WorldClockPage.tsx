import { useState } from "react"
import { Plus, X, Search, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Flag } from "@/components/Flag"
import { useApp } from "@/store/AppContext"
import { useClock } from "@/hooks/useClock"
import { CITIES, findCity, projectToPercent } from "@/lib/cities"
import { formatShortTime, getUtcOffsetLabel, isDaytime } from "@/lib/format"
import { WorldMap } from "@/components/WorldMap"

export default function WorldClockPage() {
  const { settings, setSettings, setHomeCity } = useApp()
  const now = useClock()
  const [query, setQuery] = useState("")

  const watched = settings.watchedCityIds.map(findCity).filter(Boolean) as typeof CITIES

  const results = query.trim()
    ? CITIES.filter(
        (c) =>
          !settings.watchedCityIds.includes(c.id) &&
          (c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  const addCity = (id: string) => {
    setSettings((s) => ({ ...s, watchedCityIds: [...s.watchedCityIds, id] }))
    setQuery("")
  }
  const removeCity = (id: string) => {
    setSettings((s) => ({ ...s, watchedCityIds: s.watchedCityIds.filter((c) => c !== id) }))
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Card className="animate-fade-up p-5 md:p-6">
        <h2 className="mb-1 text-xl font-bold tracking-tight">World Clock</h2>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Real local time, everywhere you work. Click the star to set your home time zone.
        </p>

        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="pl-10"
          />
          {results.length > 0 && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] shadow-lg">
              {results.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  onClick={() => addCity(c.id)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-[var(--color-paper-2)]"
                >
                  <span className="flex items-center gap-2">
                    <Flag code={c.code} className="h-3.5 w-5" />
                    {c.name}, {c.country}
                  </span>
                  <Plus className="h-3.5 w-3.5 text-[var(--color-muted)]" />
                </button>
              ))}
            </div>
          )}
        </div>

        <ul className="flex flex-col divide-y divide-[var(--color-line)]">
          {watched.map((c) => {
            const isHome = c.id === settings.homeCityId
            return (
              <li key={c.id} className="group flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setHomeCity(c.id)}
                    aria-label={isHome ? `${c.name} is your home time zone` : `Set ${c.name} as home`}
                    className="shrink-0"
                  >
                    <Star
                      className={`h-4 w-4 transition-colors ${
                        isHome ? "fill-[var(--color-ember)] text-[var(--color-ember)]" : "text-[var(--color-line)] hover:text-[var(--color-ember)]"
                      }`}
                    />
                  </button>
                  <Flag code={c.code} className="h-4 w-5.5" />
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">{getUtcOffsetLabel(c.timeZone, now)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="tabular text-sm font-semibold">{formatShortTime(now, settings.timeFormat, c.timeZone)}</p>
                    <p className="text-[10px] text-[var(--color-muted)]">{isDaytime(c.timeZone, now) ? "☀ Day" : "🌙 Night"}</p>
                  </div>
                  <button
                    onClick={() => removeCity(c.id)}
                    disabled={isHome}
                    className="rounded-full p-1 text-[var(--color-muted)] opacity-0 transition-opacity hover:text-[var(--color-ember)] group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-0"
                    aria-label={`Remove ${c.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            )
          })}
          {watched.length === 0 && (
            <li className="py-6 text-center text-sm text-[var(--color-muted)]">No cities yet — search above to add one.</li>
          )}
        </ul>
      </Card>

      <Card className="animate-fade-up overflow-hidden p-5 md:p-6" style={{ animationDelay: "80ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[var(--color-muted)]">Live Map</h3>
          <p className="text-xs text-[var(--color-muted)]">Click a pin to set it as home</p>
        </div>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]">
          <WorldMap dotClassName="fill-[var(--color-muted)]" />
          {watched.map((c) => {
            const { x, y } = projectToPercent(c.lat, c.lng)
            const day = isDaytime(c.timeZone, now)
            const isHome = c.id === settings.homeCityId
            return (
              <button
                key={c.id}
                onClick={() => setHomeCity(c.id)}
                className="group/pin absolute -translate-x-1/2 -translate-y-1/2 animate-fade-in cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={`rounded-full border-2 border-white shadow transition-transform group-hover/pin:scale-125 ${
                      isHome ? "h-3.5 w-3.5 bg-[var(--color-ember)] ring-2 ring-[var(--color-ember)]/40" : day ? "h-3 w-3 bg-[var(--color-ember)]" : "h-3 w-3 bg-slate-500"
                    }`}
                  />
                  <div
                    className={`mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold shadow transition-opacity ${
                      isHome ? "bg-[var(--color-ember)] text-white opacity-100" : "bg-[var(--color-ink)] text-[var(--color-paper)] opacity-90"
                    }`}
                  >
                    {isHome && "★ "}
                    {c.name} · {formatShortTime(now, settings.timeFormat, c.timeZone)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
