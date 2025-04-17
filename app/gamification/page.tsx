"use client"

import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { Trophy, Award, Star, TrendingUp, Clock } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useGamificationStore } from "@/lib/store/root-store"
import { BadgesShowcase } from "@/components/gamification/badges-showcase"
import { Leaderboard } from "@/components/gamification/leaderboard"
import { useAuth } from "@/contexts/auth-context"

const GamificationPage = observer(() => {
  const gamificationStore = useGamificationStore()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      gamificationStore.fetchUserGamificationProfile()
      gamificationStore.fetchAvailableBadges()
    }
  }, [gamificationStore, user])

  if (!user) {
    return (
      <DashboardShell>
        <div className="container py-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Gamification</h1>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Please log in to view your gamification profile</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Gamification</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Points</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gamificationStore.isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-3xl font-bold">{gamificationStore.profile?.total_points || 0}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Level</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gamificationStore.isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-3xl font-bold">{gamificationStore.profile?.level || 1}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <span>Badges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gamificationStore.isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-3xl font-bold">{gamificationStore.profile?.badges?.length || 0}</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Progress</span>
                  </CardTitle>
                  <CardDescription>
                    Level {gamificationStore.profile?.level || 1} •{" "}
                    {gamificationStore.getProgressToNextLevel().toFixed(0)}% complete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {gamificationStore.isLoading ? (
                    <Skeleton className="h-4 w-full" />
                  ) : (
                    <>
                      <Progress value={gamificationStore.getProgressToNextLevel()} className="h-2 mb-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{((gamificationStore.profile?.level || 1) - 1) * 100} pts</span>
                        <span>{gamificationStore.profile?.next_level_points || 100} pts</span>
                      </div>
                    </>
                  )}

                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-3">Your Badges</h3>
                    <BadgesShowcase limit={10} className="justify-start" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {gamificationStore.isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : gamificationStore.profile?.recent_achievements?.length ? (
                    <div className="space-y-3">
                      {gamificationStore.profile.recent_achievements.map((achievement) => (
                        <div key={achievement.id} className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Star className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground">+{achievement.points} points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="leaderboard">
            <TabsList className="mb-6">
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="badges">Available Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard">
              <Leaderboard limit={10} />
            </TabsContent>

            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle>Available Badges</CardTitle>
                  <CardDescription>Earn these badges by participating in the community</CardDescription>
                </CardHeader>
                <CardContent>
                  {gamificationStore.isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {gamificationStore.availableBadges.map((badge) => {
                        const isEarned = gamificationStore.profile?.badges?.some((b) => b.badge_id === badge.id)
                        return (
                          <div
                            key={badge.id}
                            className={`flex gap-4 p-3 rounded-lg ${isEarned ? "bg-primary/10" : "bg-muted/50"}`}
                          >
                            <div
                              className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundImage: badge.image_url ? `url(${badge.image_url})` : undefined,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              {!badge.image_url && (
                                <span className="text-sm font-bold">{badge.name.substring(0, 2)}</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium flex items-center gap-2">
                                {badge.name}
                                {isEarned && <Award className="h-4 w-4 text-primary" />}
                              </h3>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                              <p className="text-xs mt-1">
                                {isEarned ? (
                                  <span className="text-primary">Earned</span>
                                ) : (
                                  <span>Required: {badge.points_value} points</span>
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
})

export default GamificationPage
