"use client"

import { observer } from "mobx-react-lite"
import { TrendingUp, Award, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useGamificationStore } from "@/lib/store/root-store"
import { useEffect } from "react"

interface PointsDisplayProps {
  variant?: "compact" | "full"
  className?: string
}

export const PointsDisplay = observer(({ variant = "full", className = "" }: PointsDisplayProps) => {
  const gamificationStore = useGamificationStore()

  useEffect(() => {
    if (!gamificationStore.profile) {
      gamificationStore.fetchUserGamificationProfile()
    }
  }, [gamificationStore])

  if (gamificationStore.isLoading) {
    return variant === "compact" ? (
      <div className={`flex items-center gap-2 ${className}`}>
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-14 rounded" />
      </div>
    ) : (
      <div className={`p-4 border rounded-lg ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-10 rounded" />
        </div>
        <Skeleton className="h-4 w-full rounded mb-4" />
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </div>
    )
  }

  if (!gamificationStore.profile) {
    return null
  }

  const { total_points, level, next_level_points } = gamificationStore.profile
  const progressToNextLevel = gamificationStore.getProgressToNextLevel()

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Star className="h-4 w-4 text-yellow-500" />
        <span className="text-sm">{total_points} pts</span>
      </div>
    )
  }

  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <span className="font-medium">Level {level}</span>
        </div>
        <span className="text-lg font-bold">{total_points} pts</span>
      </div>

      <Progress value={progressToNextLevel} className="h-2 mb-2" />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4" />
        <span>{next_level_points - total_points} points to next level</span>
      </div>
    </div>
  )
})
