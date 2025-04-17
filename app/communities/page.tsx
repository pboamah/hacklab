"use client"

import Link from "next/link"
import { Plus, Users } from "lucide-react"
import { observer } from "mobx-react-lite"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCommunityStore } from "@/lib/store/root-store"
import { useEffect, useState } from "react"

const CommunitiesPage = observer(() => {
  const communityStore = useCommunityStore()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    communityStore.fetchCommunities()
  }, [communityStore])

  const filteredCommunities = communityStore.communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardShell>
      <DashboardHeader heading="Communities" text="Explore communities and connect with like-minded people">
        <Button asChild>
          <Link href="/communities/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Community
          </Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6">
        <div className="relative">
          <Input
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <Card key={community.id}>
              <CardHeader>
                <CardTitle>{community.name}</CardTitle>
                <CardDescription>{community.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={community.image_url || "/placeholder.svg"} alt={community.name} />
                    <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">{community.name}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {community.memberCount} members
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/communities/${community.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Community
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
})

export default CommunitiesPage
