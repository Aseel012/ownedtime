import React from "react"

export function AnimatePresenceWrapper({
  routeKey,
  children,
}: {
  routeKey: string
  children: React.ReactNode
}) {
  return (
    <div key={routeKey} className="animate-fade-up">
      {children}
    </div>
  )
}
