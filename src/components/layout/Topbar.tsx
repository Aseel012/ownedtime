import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title?: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-paper)]/90 px-4 py-3 backdrop-blur md:px-8">
      <button
        onClick={onMenuClick}
        className="rounded-full p-2 text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {title && <h1 className="text-sm font-semibold md:hidden">{title}</h1>}

      <div className="relative ml-auto hidden max-w-sm flex-1 md:ml-0 md:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
        <Input placeholder="Search anything..." className="pl-10" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
          Log In
        </Button>
        <Button size="sm">Get the App</Button>
      </div>
    </header>
  )
}
