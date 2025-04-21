"use client"

import { observer } from "mobx-react-lite"
import { useGamificationStore } from "@/lib/store"

interface PointsDisplayProps {
  variant?: "default" | "compact"
}

export const PointsDisplay = observer(({ variant = "default" }: PointsDisplayProps) => {
  const gamificationStore = useGamificationStore()

  if (variant === "compact") {
    return <span>{gamificationStore.points}</span>
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold">Points:</span>
      <span>{gamificationStore.points}</span>
    </div>
  )
})
