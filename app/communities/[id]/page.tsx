"use client"
import Link from "next/link"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  Bell,
  Calendar,
  ChevronLeft,
  Edit,
  Globe,
  Info,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
  Share2,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardShell } from "@/components/dashboard-shell"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useCommunityStore } from "@/lib/store/root-store"
import { Skeleton } from "@/components/ui/skeleton"

const CommunityPage = observer(({ params }: { params: { id: string } }) => {
  const { toast } = useToast()
  const { user } = useAuth()
  const communityStore = useCommunityStore()
  const communityId = params.id

  useEffect(() => {
    communityStore.fetchCommunityById(communityId)
  }, [communityId, communityStore])

  const community = communityStore.currentCommunity

  const handleJoinCommunity = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join communities",
        variant: "destructive",
      })
      return
    }

    const success = await communityStore.joinCommunity(communityId)
    if (success) {
      toast({
        title: "Joined community",
        description: `You have successfully joined ${community?.name}.`,
      })
    }
  }

  const handleLeaveCommunity = async () => {
    if (!user) return

    const success = await communityStore.leaveCommunity(communityId)
    if (success) {
      toast({
        title: "Left community",
        description: `You have left ${community?.name}.`,
      })
    }
  }

  const handleShareCommunity = () => {
    navigator.clipboard.writeText(`https://community-platform.com/communities/${communityId}`)
    toast({
      title: "Link copied",
      description: "Community link has been copied to clipboard.",
    })
  }

  if (communityStore.isLoading || !community) {
    return (
      <DashboardShell>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>

          <Skeleton className="h-48 w-full rounded-lg" />

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
              </Card>
            </div>
            <div className="md:w-1/3 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/communities">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{community.name}</h1>
            <Badge variant={community.privacy === "private" ? "outline" : "secondary"}>
              {community.privacy === "private" ? "Private" : "Public"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {community.isMember ? (
              <>
                <Button variant="outline" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm" onClick={handleLeaveCommunity} disabled={communityStore.isLoading}>
                  {communityStore.isLoading ? "Processing..." : "Leave"}
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleJoinCommunity} disabled={communityStore.isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                {communityStore.isLoading ? "Processing..." : "Join Community"}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleShareCommunity}>
              <Share2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Info className="mr-2 h-4 w-4" />
                  Report Community
                </DropdownMenuItem>
                {community.isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Community
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Community Settings
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div
          className="h-48 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${community.coverImage || community.image_url})` }}
        />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{community.description}</p>
                <div className="flex flex-wrap gap-1 mt-4">
                  {community.tags &&
                    community.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{community.memberCount} members</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{community.discussions?.length || 0} posts</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Created {new Date(community.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="discussions" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="discussions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Discussions</h2>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                  </Button>
                </div>

                {community.discussions && community.discussions.length > 0 ? (
                  community.discussions.map((discussion, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={discussion.author.avatar_url || "/placeholder.svg"}
                                alt={discussion.author.full_name}
                              />
                              <AvatarFallback>{discussion.author.full_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{discussion.title}</CardTitle>
                              <CardDescription>
                                Posted by {discussion.author.full_name} •{" "}
                                {new Date(discussion.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline">{discussion.category || "Discussion"}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-muted-foreground line-clamp-2">{discussion.content}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {discussion.comments?.length || 0} comments
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/communities/${community.id}/discussions/${discussion.id}`}>
                            View Discussion
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center mb-4">No discussions yet</p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Start First Discussion
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Upcoming Events</h2>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </div>

                {community.events && community.events.length > 0 ? (
                  community.events.map((event, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{event.name}</CardTitle>
                          <Badge variant={event.is_virtual ? "outline" : "secondary"}>
                            {event.is_virtual ? "Virtual" : "In-Person"}
                          </Badge>
                        </div>
                        <CardDescription>
                          {new Date(event.start_date).toLocaleDateString()} •{" "}
                          {new Date(event.start_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                        {event.location && (
                          <div className="flex items-center mt-2 text-sm">
                            <Globe className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="mr-1 h-4 w-4" />
                          {event.attendees?.length || 0} attending
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center mb-4">No upcoming events</p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Event
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Shared Resources</h2>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </div>

                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center mb-4">No resources have been shared yet</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Share First Resource
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Leaders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {community.members &&
                  community.members
                    .filter((member) => member.role === "admin" || member.role === "moderator")
                    .map((leader, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={leader.user.avatar_url || "/placeholder.svg"} alt={leader.user.full_name} />
                          <AvatarFallback>{leader.user.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{leader.user.full_name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{leader.role}</p>
                        </div>
                      </div>
                    ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {community.members &&
                    community.members.slice(0, 10).map((member, index) => (
                      <Avatar key={index} className="h-10 w-10 border-2 border-background">
                        <AvatarImage src={member.user.avatar_url || "/placeholder.svg"} alt={member.user.full_name} />
                        <AvatarFallback>{member.user.full_name.charAt(0)}</AvatarFallback>
                        <span className="sr-only">{member.user.full_name}</span>
                      </Avatar>
                    ))}
                  {community.memberCount > 10 && (
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted border-2 border-background text-xs">
                      +{community.memberCount - 10}
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/communities/${community.id}/members`}>
                    <Users className="mr-2 h-4 w-4" />
                    View All Members
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Communities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communityStore.communities
                  .filter((c) => c.id !== community.id && c.category === community.category)
                  .slice(0, 3)
                  .map((related, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={related.image_url || "/placeholder.svg"} alt={related.name} />
                        <AvatarFallback>{related.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{related.name}</p>
                        <p className="text-sm text-muted-foreground">{related.memberCount} members</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => communityStore.joinCommunity(related.id)}
                        disabled={related.isMember || communityStore.isLoading}
                      >
                        {related.isMember ? "Joined" : "Join"}
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
})

export default CommunityPage
