"use client"

import { observer } from "mobx-react-lite"
import { useGamificationStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const AchievementsList = observer(() => {
  const gamificationStore = useGamificationStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Your earned badges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {gamificationStore.achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{achievement.name}</div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </div>
              <Badge variant="outline">{achievement.points} pts</Badge>
            </div>
          ))}

          {gamificationStore.achievements.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No achievements yet. Start participating to earn badges!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
