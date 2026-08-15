import { NavLink } from "react-router-dom"
import {
  Clock,
  Timer,
  BarChart3,
  Globe2,
  Calendar,
  ListChecks,
  LineChart,
  Settings,
  Crown,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const NAV = [
  { to: "/", label: "Clock", icon: Clock, end: true },
  { to: "/pomodoro", label: "Pomodoro", icon: Timer },
  { to: "/stats", label: "Stats", icon: BarChart3 },
  { to: "/world-clock", label: "World Clock", icon: Globe2 },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/insights", label: "Insights", icon: LineChart, badge: "New" },
  { to: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({
  onNavigate,
  onClose,
}: {
  onNavigate?: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex h-full w-64 shrink-0 flex-col justify-between border-r border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-6">
      <div>
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)]">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">NoTime</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-paper-2)] md:hidden"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group flex items-center justify-between rounded-full px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)] shadow-sm"
                    : "text-[var(--color-ink)]/80 hover:bg-[var(--color-paper-2)]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.badge && !isActive && (
                    <span className="rounded-full bg-[var(--color-ember-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-ember)]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ember-soft)] text-[var(--color-ember)]">
            <Crown className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Go Premium</p>
          </div>
        </div>
        <p className="mb-3 text-xs leading-snug text-[var(--color-muted)]">
          Unlock streaks, insights and more productivity tools.
        </p>
        <Button size="sm" className="w-full" variant="default">
          Upgrade Now
        </Button>
      </div>
    </div>
  )
}
