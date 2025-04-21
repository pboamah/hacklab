"use client"

import Link from "next/link"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RecentSales } from "@/components/recent-sales"
import { useAuth } from "@/contexts/auth-context"
import { PointsDisplay } from "@/components/gamification/points-display"
import { AchievementsList } from "@/components/gamification/achievements-list"
import { useCommunityStore } from "@/lib/store"

const DashboardPage = observer(() => {
  const { user } = useAuth()
  const communityStore = useCommunityStore()

  useEffect(() => {
    if (user) {
      communityStore.fetchCommunities()
    }
  }, [communityStore, user])

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Track your progress and stay connected">
        <Button variant="outline" asChild>
          <Link href="/communities">Explore Communities</Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle>Total Points</CardTitle>
              <CardDescription>Total points earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <PointsDisplay variant="compact" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Registered for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              {/* Insert Upcoming Events Chart here */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle>Communities</CardTitle>
              <CardDescription>Joined or created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{communityStore.myCommunities?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Platform interactions</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {/*  Chart goes here */}
                <div className="h-[350px] text-center text-muted-foreground flex items-center justify-center rounded-md bg-muted">
                  <p>Analytics Charts</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <AchievementsList />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
})

export default DashboardPage
