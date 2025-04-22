import type React from "react"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="mx-auto max-w-7xl py-6 md:py-10 lg:py-14 px-4 md:px-6">{children}</div>
      </div>
    </div>
  )
}

export default DashboardShell
