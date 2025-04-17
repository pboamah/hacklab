"use client"

import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { Trophy, Award, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useGamificationStore } from "@/lib/store/root-store"

interface LeaderboardProps {
  limit?: number
  className?: string
}

export const Leaderboard = observer(({ limit = 10, className = "" }: LeaderboardProps) => {
  const gamificationStore = useGamificationStore()

  useEffect(() => {
    gamificationStore.fetchLeaderboard(limit)
  }, [gamificationStore, limit])

  if (gamificationStore.isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-6 text-center">
                <Skeleton className="h-4 w-4 mx-auto rounded" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 rounded mb-1" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
              <Skeleton className="h-4 w-10 rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-2 sm:px-6">
        {gamificationStore.leaderboard.map((entry, index) => (
          <div key={entry.user_id} className="flex items-center gap-4">
            <div className="w-6 text-center">
              {index === 0 ? (
                <Trophy className="h-5 w-5 text-yellow-500 mx-auto" />
              ) : index === 1 ? (
                <Award className="h-5 w-5 text-gray-400 mx-auto" />
              ) : index === 2 ? (
                <Shield className="h-5 w-5 text-amber-700 mx-auto" />
              ) : (
                <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
              )}
            </div>
            <Avatar>
              <AvatarImage src={entry.user_avatar || "/placeholder.svg"} alt={entry.user_name} />
              <AvatarFallback>{entry.user_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium truncate">{entry.user_name}</p>
              <p className="text-xs text-muted-foreground">Level {entry.level}</p>
            </div>
            <div className="text-sm font-medium">{entry.total_points} pts</div>
          </div>
        ))}

        {gamificationStore.leaderboard.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">No leaderboard data available</div>
        )}
      </CardContent>
    </Card>
  )
})
