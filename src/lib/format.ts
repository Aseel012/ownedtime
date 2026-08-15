import type { TimeFormat } from "@/store/AppContext"

export function formatTime(date: Date, format: TimeFormat, timeZone?: string) {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: format === "12h",
    timeZone,
  }
  return new Intl.DateTimeFormat("en-US", opts).format(date)
}

export function formatShortTime(date: Date, format: TimeFormat, timeZone?: string) {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: format === "12h",
    timeZone,
  }
  return new Intl.DateTimeFormat("en-US", opts).format(date)
}

export function formatDateLong(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(date)
}

export function getUtcOffsetLabel(timeZone: string, date = new Date()) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  })
  const part = dtf.formatToParts(date).find((p) => p.type === "timeZoneName")
  if (!part) return "UTC+0"
  return part.value.replace("GMT", "UTC")
}

export function isDaytime(timeZone: string, date = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone }).format(date)
  )
  return hour >= 6 && hour < 18
}

export function pad2(n: number) {
  return n.toString().padStart(2, "0")
}

export function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  if (h > 0) return `${h}h ${pad2(m)}m`
  return `${m}m ${pad2(s)}s`
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}
