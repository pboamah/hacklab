"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { observer } from "mobx-react-lite"
import {
  Calendar,
  Check,
  ChevronRight,
  Copy,
  Edit,
  FileCode,
  FileText,
  Github,
  Link2,
  MoreHorizontal,
  Plus,
  Send,
  Trash2,
  Trophy,
  Users,
  Video,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useHackathonStore } from "@/lib/store/root-store"

const TeamDashboardPage = observer(({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const { toast } = useToast()
  const hackathonStore = useHackathonStore()
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteLink, setInviteLink] = useState("https://hacklabconnect.com/invite/team123")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    hackathonStore.fetchTeamById(params.id)
  }, [hackathonStore, params.id])

  const team = hackathonStore.currentTeam

  const handleInviteMember = () => {
    if (!inviteEmail) return

    hackathonStore.inviteTeamMember(team.id, inviteEmail)
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    })

    setInviteEmail("")
  }

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: "Invite link copied",
      description: "The invitation link has been copied to your clipboard",
    })
  }

  const handleRemoveMember = (memberId: string) => {
    hackathonStore.removeTeamMember(team.id, memberId)
    toast({
      title: "Member removed",
      description: "The team member has been removed from the team",
    })
  }

  const handleSubmitProject = () => {
    router.push("/hackathons/submit")
  }

  if (hackathonStore.isLoading || !team) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Loading team...</h1>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={team.name} text={`Team for ${team.hackathon?.name || "Hackathon"}`}>
        <div className="flex items-center gap-2">
          {team.status === "forming" && <Button onClick={handleSubmitProject}>Submit Project</Button>}
          {team.status === "submitted" && (
            <Link href={`/hackathons/projects/${team.submission?.id}`}>
              <Button variant="outline">View Submission</Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Team Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => hackathonStore.updateTeam(team.id, { ...team })}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Team Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                View Hackathon Schedule
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  hackathonStore.deleteTeam(team.id)
                  router.push("/hackathons")
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Dashboard</CardTitle>
              <CardDescription>Manage your team and prepare for the hackathon</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="members" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="members">
                    <Users className="mr-2 h-4 w-4" />
                    Team Members
                  </TabsTrigger>
                  <TabsTrigger value="project">
                    <FileCode className="mr-2 h-4 w-4" />
                    Project
                  </TabsTrigger>
                  <TabsTrigger value="resources">
                    <FileText className="mr-2 h-4 w-4" />
                    Resources
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Team Members ({team.members?.filter((m) => m.status === "active").length || 0}/
                        {team.maxMembers || 5})
                      </h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" disabled={(team.members?.length || 0) >= (team.maxMembers || 5)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Invite Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                            <DialogDescription>
                              Send an invitation to join your team for the {team.hackathon?.name || "hackathon"}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                placeholder="Enter email address"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                              />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              <Label>Or share invitation link</Label>
                              <div className="flex gap-2">
                                <Input value={inviteLink} readOnly />
                                <Button variant="outline" size="icon" onClick={handleCopyInviteLink}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Anyone with this link can join your team if they have a Hacklab Connect account.
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {}}>
                              Cancel
                            </Button>
                            <Button onClick={handleInviteMember} disabled={!inviteEmail}>
                              Send Invitation
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3">
                      {team.members?.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center">
                                {member.name}
                                {member.role === "owner" && (
                                  <Badge variant="outline" className="ml-2">
                                    Owner
                                  </Badge>
                                )}
                                {member.status === "pending" && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  >
                                    Pending
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                          {member.role !== "owner" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {member.status === "pending" && (
                                  <DropdownMenuItem onClick={() => hackathonStore.resendInvitation(team.id, member.id)}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Resend Invitation
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove from Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      ))}

                      {(team.members?.length || 0) < (team.maxMembers || 5) && (
                        <div className="border border-dashed rounded-md p-4 text-center">
                          <p className="text-muted-foreground mb-2">
                            You can add {(team.maxMembers || 5) - (team.members?.length || 0)} more team members
                          </p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Invite Member
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Invite Team Member</DialogTitle>
                                <DialogDescription>
                                  Send an invitation to join your team for the {team.hackathon?.name || "hackathon"}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="email2">Email Address</Label>
                                  <Input
                                    id="email2"
                                    placeholder="Enter email address"
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                  />
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <Label>Or share invitation link</Label>
                                  <div className="flex gap-2">
                                    <Input value={inviteLink} readOnly />
                                    <Button variant="outline" size="icon" onClick={handleCopyInviteLink}>
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Anyone with this link can join your team if they have a Hacklab Connect account.
                                  </p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => {}}>
                                  Cancel
                                </Button>
                                <Button onClick={handleInviteMember} disabled={!inviteEmail}>
                                  Send Invitation
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="project" className="space-y-4">
                  {team.submission ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">{team.submission.name}</h3>
                        <Badge className="bg-green-500">Submitted</Badge>
                      </div>

                      <p className="text-muted-foreground">{team.submission.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Github className="h-4 w-4 mr-2" />
                          <span className="font-medium mr-2">Repository:</span>
                          <a
                            href={team.submission.repoLink}
                            className="text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {team.submission.repoLink}
                          </a>
                        </div>
                        {team.submission.demoLink && (
                          <div className="flex items-center">
                            <Link2 className="h-4 w-4 mr-2" />
                            <span className="font-medium mr-2">Demo:</span>
                            <a
                              href={team.submission.demoLink}
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {team.submission.demoLink}
                            </a>
                          </div>
                        )}
                        {team.submission.videoLink && (
                          <div className="flex items-center">
                            <Video className="h-4 w-4 mr-2" />
                            <span className="font-medium mr-2">Video:</span>
                            <a
                              href={team.submission.videoLink}
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {team.submission.videoLink}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Submitted on {team.submission.submittedAt}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/hackathons/projects/${team.submission.id}`}>
                          <Button variant="outline">View Full Submission</Button>
                        </Link>
                        <Link href={`/hackathons/submit?edit=true`}>
                          <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Submission
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center mx-auto mb-4">
                        <FileCode className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Project Submitted Yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Your team hasn't submitted a project for the hackathon yet. Submit your project before the
                        deadline.
                      </p>
                      <Button onClick={handleSubmitProject}>Submit Project</Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Hackathon Resources</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Documentation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <FileText className="h-4 w-4 mr-2" />
                                Hackathon Guidelines
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <FileText className="h-4 w-4 mr-2" />
                                Judging Criteria
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <FileText className="h-4 w-4 mr-2" />
                                Submission Requirements
                              </a>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">API Resources</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <FileCode className="h-4 w-4 mr-2" />
                                OpenAI API Documentation
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <FileCode className="h-4 w-4 mr-2" />
                                Google Cloud Vision API
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <FileCode className="h-4 w-4 mr-2" />
                                Azure Cognitive Services
                              </a>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Datasets</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <FileText className="h-4 w-4 mr-2" />
                                Healthcare Dataset
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <FileText className="h-4 w-4 mr-2" />
                                Education Dataset
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <FileText className="h-4 w-4 mr-2" />
                                Financial Inclusion Dataset
                              </a>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Tutorials</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <Video className="h-4 w-4 mr-2" />
                                Introduction to AI and ML
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <Video className="h-4 w-4 mr-2" />
                                Working with APIs
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center text-primary hover:underline">
                                <Video className="h-4 w-4 mr-2" />
                                Building Effective UIs
                              </a>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Chat</CardTitle>
              <CardDescription>Communicate with your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 border rounded-md p-4 mb-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=JD" alt="John Doe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">John Doe</span>
                        <span className="text-xs text-muted-foreground">10:30 AM</span>
                      </div>
                      <p className="text-sm">
                        Hey team! I've been thinking about our project idea. What if we focus on an AI-powered health
                        assistant?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=JS" alt="Jane Smith" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Jane Smith</span>
                        <span className="text-xs text-muted-foreground">10:35 AM</span>
                      </div>
                      <p className="text-sm">
                        That sounds interesting! I've been working with healthcare data before. We could use machine
                        learning to analyze symptoms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=JD" alt="John Doe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">John Doe</span>
                        <span className="text-xs text-muted-foreground">10:42 AM</span>
                      </div>
                      <p className="text-sm">
                        Exactly! We could also integrate with wearable devices for real-time monitoring. What do you
                        think?
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Textarea placeholder="Type your message..." className="min-h-[40px]" />
                <Button size="icon" className="h-10 w-10">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hackathon Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Event Information</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Event:</span>
                    <span>{team.hackathon?.name || "Hackathon"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Dates:</span>
                    <span>
                      {team.hackathon?.startDate || "TBD"} - {team.hackathon?.endDate || "TBD"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="capitalize">
                      {team.hackathon?.status || "upcoming"}
                    </Badge>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Submission Deadline:</span>
                    <span>{team.hackathon?.submissionDeadline || "TBD"}</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Team Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Team Formation:</span>
                    <Badge variant={team.status === "forming" ? "outline" : "secondary"} className="capitalize">
                      {team.status === "forming" ? (
                        <span className="flex items-center">
                          In Progress
                          <span className="ml-1 h-2 w-2 rounded-full bg-yellow-500"></span>
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Complete
                          <Check className="ml-1 h-3 w-3" />
                        </span>
                      )}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Project Submission:</span>
                    <Badge variant={team.status === "submitted" ? "secondary" : "outline"} className="capitalize">
                      {team.status === "submitted" ? (
                        <span className="flex items-center">
                          Submitted
                          <Check className="ml-1 h-3 w-3" />
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Pending
                          <span className="ml-1 h-2 w-2 rounded-full bg-yellow-500"></span>
                        </span>
                      )}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Judging:</span>
                    <Badge variant="outline" className="capitalize">
                      Not Started
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Next Steps</h3>
                <ul className="space-y-2">
                  {(team.members?.length || 0) < (team.maxMembers || 5) && (
                    <li className="flex items-center text-sm">
                      <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                      Invite more team members
                    </li>
                  )}
                  {team.status !== "submitted" && (
                    <li className="flex items-center text-sm">
                      <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                      Submit your project
                    </li>
                  )}
                  <li className="flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                    Prepare for presentation
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/hackathons/${team.hackathon?.id || "1"}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Hackathon Details
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Event Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Trophy className="mr-2 h-4 w-4" />
                View Prizes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Find Mentors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
})

export default TeamDashboardPage
