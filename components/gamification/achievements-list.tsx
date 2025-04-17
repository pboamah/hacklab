"use client"

import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGamificationStore } from "@/lib/store/root-store"

interface AchievementsListProps {
  userId?: string
  limit?: number
  className?: string
}

export const AchievementsList = observer(({ userId, limit = 10, className = "" }: AchievementsListProps) => {
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
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!gamificationStore.profile?.recent_achievements || gamificationStore.profile.recent_achievements.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">No achievements yet</p>
        </CardContent>
      </Card>
    )
  }

  const achievements = gamificationStore.profile.recent_achievements.slice(0, limit)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm">{achievement.description}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>+{achievement.points} points</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(achievement.created_at), { addSuffix: true })}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
