"use client"

import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useGamificationStore } from "@/lib/store/root-store"
import { BadgesShowcase } from "@/components/gamification/badges-showcase"

interface ProgressCardProps {
  userId?: string
  className?: string
}

export const ProgressCard = observer(({ userId, className = "" }: ProgressCardProps) => {
  const gamificationStore = useGamificationStore()

  useEffect(() => {
    if (!gamificationStore.profile) {
      gamificationStore.fetchUserGamificationProfile()
    }
  }, [gamificationStore])

  if (gamificationStore.isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!gamificationStore.profile) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <span>Your Progress</span>
        </CardTitle>
        <CardDescription>
          Level {gamificationStore.profile.level} • {gamificationStore.getProgressToNextLevel().toFixed(0)}% complete
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={gamificationStore.getProgressToNextLevel()} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{(gamificationStore.profile.level - 1) * 100} pts</span>
          <span>{gamificationStore.profile.next_level_points} pts</span>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Your Badges</h3>
          <BadgesShowcase limit={5} className="justify-start" />
        </div>
      </CardContent>
    </Card>
  )
})
