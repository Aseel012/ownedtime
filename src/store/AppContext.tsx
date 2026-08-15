import React, { createContext, useContext, useEffect, useMemo } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"

export type Appearance = "light" | "dark" | "system"
export type TimeFormat = "12h" | "24h"
export const ACCENTS = [
  { id: "ember", value: "#e8562f" },
  { id: "amber", value: "#e0983c" },
  { id: "pink", value: "#e2568f" },
  { id: "violet", value: "#8b5ce2" },
  { id: "blue", value: "#3a86e0" },
  { id: "green", value: "#3fae66" },
] as const

export interface Settings {
  appearance: Appearance
  accent: string
  timeFormat: TimeFormat
  pomodoroDefault: number // minutes
  shortBreak: number
  longBreak: number
  homeCityId: string
  watchedCityIds: string[]
}

export interface Task {
  id: string
  title: string
  done: boolean
  createdAt: number
  list: "Today" | "Upcoming" | "Someday"
}

export interface PomodoroSession {
  id: string
  date: string // yyyy-mm-dd
  startedAt: number
  durationMin: number
  type: "focus" | "short-break" | "long-break"
  completed: boolean
  label?: string
}

const DEFAULT_SETTINGS: Settings = {
  appearance: "system",
  accent: "ember",
  timeFormat: "24h",
  pomodoroDefault: 25,
  shortBreak: 5,
  longBreak: 15,
  homeCityId: "london",
  watchedCityIds: ["london", "new-york", "tokyo", "sydney", "dubai"],
}

const DEFAULT_TASKS: Task[] = [
  { id: "t1", title: "UI Design", done: true, createdAt: Date.now() - 90000, list: "Today" },
  { id: "t2", title: "Research", done: true, createdAt: Date.now() - 80000, list: "Today" },
  { id: "t3", title: "Development", done: false, createdAt: Date.now() - 70000, list: "Today" },
  { id: "t4", title: "Review", done: false, createdAt: Date.now() - 60000, list: "Today" },
  { id: "t5", title: "Meeting Prep", done: false, createdAt: Date.now() - 50000, list: "Upcoming" },
]

function seedSessions(): PomodoroSession[] {
  const sessions: PomodoroSession[] = []
  const now = Date.now()
  // Roughly mirror the reference dashboard: a productive last 7 days with a rest day mixed in.
  const dailyFocusSessions = [5, 6, 3, 7, 5, 4, 2]
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const day = new Date(now - dayOffset * 86400000)
    const dateKey = day.toISOString().slice(0, 10)
    const count = dailyFocusSessions[6 - dayOffset]
    for (let i = 0; i < count; i++) {
      const startedAt = new Date(day)
      startedAt.setHours(9 + i * 2, (i * 13) % 60, 0, 0)
      sessions.push({
        id: crypto.randomUUID(),
        date: dateKey,
        startedAt: startedAt.getTime(),
        durationMin: 25,
        type: "focus",
        completed: true,
      })
      // occasional short break after a focus block
      if (i % 2 === 1) {
        sessions.push({
          id: crypto.randomUUID(),
          date: dateKey,
          startedAt: startedAt.getTime() + 25 * 60000,
          durationMin: 5,
          type: "short-break",
          completed: true,
        })
      }
    }
  }
  return sessions
}

interface AppContextValue {
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  addTask: (title: string, list?: Task["list"]) => void
  toggleTask: (id: string) => void
  removeTask: (id: string) => void
  sessions: PomodoroSession[]
  addSession: (s: Omit<PomodoroSession, "id">) => void
  accentValue: string
  setHomeCity: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>("notime.settings", DEFAULT_SETTINGS)
  const [tasks, setTasks] = useLocalStorage<Task[]>("notime.tasks", DEFAULT_TASKS)
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>("notime.sessions", seedSessions())

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement
    const apply = (dark: boolean) => root.classList.toggle("dark", dark)
    if (settings.appearance === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      apply(mq.matches)
      const listener = (e: MediaQueryListEvent) => apply(e.matches)
      mq.addEventListener("change", listener)
      return () => mq.removeEventListener("change", listener)
    } else {
      apply(settings.appearance === "dark")
    }
  }, [settings.appearance])

  // Apply accent color as CSS variable
  useEffect(() => {
    const accent = ACCENTS.find((a) => a.id === settings.accent) ?? ACCENTS[0]
    document.documentElement.style.setProperty("--color-ember", accent.value)
  }, [settings.accent])

  const addTask = (title: string, list: Task["list"] = "Today") => {
    if (!title.trim()) return
    setTasks((prev) => [
      { id: crypto.randomUUID(), title: title.trim(), done: false, createdAt: Date.now(), list },
      ...prev,
    ])
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const addSession = (s: Omit<PomodoroSession, "id">) => {
    setSessions((prev) => [{ ...s, id: crypto.randomUUID() }, ...prev].slice(0, 500))
  }

  const setHomeCity = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      homeCityId: id,
      watchedCityIds: prev.watchedCityIds.includes(id) ? prev.watchedCityIds : [id, ...prev.watchedCityIds],
    }))
  }

  const accentValue = useMemo(
    () => ACCENTS.find((a) => a.id === settings.accent)?.value ?? ACCENTS[0].value,
    [settings.accent]
  )

  const value: AppContextValue = {
    settings,
    setSettings,
    tasks,
    setTasks,
    addTask,
    toggleTask,
    removeTask,
    sessions,
    addSession,
    accentValue,
    setHomeCity,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
