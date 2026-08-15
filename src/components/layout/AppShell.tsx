import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { AnimatePresenceWrapper } from "./PageTransition"

const TITLES: Record<string, string> = {
  "/": "Clock",
  "/pomodoro": "Pomodoro",
  "/stats": "Stats",
  "/world-clock": "World Clock",
  "/calendar": "Calendar",
  "/tasks": "Tasks",
  "/insights": "Insights",
  "/settings": "Settings",
}

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const title = TITLES[location.pathname] ?? "NoTime"

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 animate-fade-up">
            <Sidebar onNavigate={() => setDrawerOpen(false)} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setDrawerOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <AnimatePresenceWrapper routeKey={location.pathname}>
            <Outlet />
          </AnimatePresenceWrapper>
        </main>
      </div>
    </div>
  )
}
