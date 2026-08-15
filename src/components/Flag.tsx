import { useState } from "react"
import { flagUrl } from "@/lib/cities"
import { cn } from "@/lib/utils"

export function Flag({ code, className }: { code: string; className?: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[3px] bg-[var(--color-paper-2)] text-[9px] font-bold uppercase text-[var(--color-muted)]",
          className
        )}
      >
        {code}
      </span>
    )
  }

  return (
    <img
      src={flagUrl(code, 40)}
      alt={`${code.toUpperCase()} flag`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("inline-block rounded-[3px] object-cover shadow-sm ring-1 ring-black/5", className)}
    />
  )
}
