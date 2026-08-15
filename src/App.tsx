import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { AppProvider } from "@/store/AppContext"
import ClockPage from "@/pages/ClockPage"
import PomodoroPage from "@/pages/PomodoroPage"
import StatsPage from "@/pages/StatsPage"
import WorldClockPage from "@/pages/WorldClockPage"
import CalendarPage from "@/pages/CalendarPage"
import TasksPage from "@/pages/TasksPage"
import InsightsPage from "@/pages/InsightsPage"
import SettingsPage from "@/pages/SettingsPage"

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<ClockPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/world-clock" element={<WorldClockPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
