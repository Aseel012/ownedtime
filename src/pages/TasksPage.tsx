import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useApp, type Task } from "@/store/AppContext"

const LISTS: Task["list"][] = ["Today", "Upcoming", "Someday"]

export default function TasksPage() {
  const { tasks, addTask, toggleTask, removeTask } = useApp()
  const [draft, setDraft] = useState("")
  const [activeList, setActiveList] = useState<Task["list"]>("Today")

  const done = tasks.filter((t) => t.done).length
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card className="animate-fade-up p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Tasks</h2>
            <p className="text-sm text-[var(--color-muted)]">
              {done} of {tasks.length} complete
            </p>
          </div>
          <span className="text-2xl font-bold tabular">{percent}%</span>
        </div>
        <Progress value={percent} />
      </Card>

      <Card className="animate-fade-up p-5 md:p-6" style={{ animationDelay: "60ms" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addTask(draft, activeList)
            setDraft("")
          }}
          className="mb-5 flex gap-2"
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Add a task to ${activeList}...`}
            className="h-10"
          />
          <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="mb-5 flex gap-2">
          {LISTS.map((l) => (
            <button
              key={l}
              onClick={() => setActiveList(l)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeList === l ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "bg-[var(--color-paper-2)] hover:bg-[var(--color-line)]"
              }`}
            >
              {l} ({tasks.filter((t) => t.list === l).length})
            </button>
          ))}
        </div>

        <ul className="flex flex-col divide-y divide-[var(--color-line)]">
          {tasks
            .filter((t) => t.list === activeList)
            .map((t) => (
              <li key={t.id} className="group flex items-center gap-3 py-3">
                <Checkbox checked={t.done} onCheckedChange={() => toggleTask(t.id)} />
                <span className={`flex-1 text-sm ${t.done ? "text-[var(--color-muted)] line-through" : ""}`}>
                  {t.title}
                </span>
                <button
                  onClick={() => removeTask(t.id)}
                  className="rounded-full p-1.5 text-[var(--color-muted)] opacity-0 transition-opacity hover:text-[var(--color-ember)] group-hover:opacity-100"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          {tasks.filter((t) => t.list === activeList).length === 0 && (
            <li className="py-10 text-center text-sm text-[var(--color-muted)]">
              Nothing here yet. Add your first task above.
            </li>
          )}
        </ul>
      </Card>
    </div>
  )
}
