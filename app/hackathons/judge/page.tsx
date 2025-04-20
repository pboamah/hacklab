"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
  Check,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function HackathonAdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedHackathon, setExpandedHackathon] = useState<string | null>(null)

  const toggleHackathon = (id: string) => {
    if (expandedHackathon === id) {
      setExpandedHackathon(null)
    } else {
      setExpandedHackathon(id)
    }
  }

  const handleDeleteHackathon = (id: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Hackathon deleted",
        description: "The hackathon has been deleted successfully.",
      })
    }, 1000)
  }

  const handleApproveTeam = (id: string) => {
    toast({
      title: "Team approved",
      description: "The team has been approved to participate in the hackathon.",
    })
  }

  const handleRejectTeam = (id: string) => {
    toast({
      title: "Team rejected",
      description: "The team has been rejected from participating in the hackathon.",
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Hackathon Administration" text="Manage hackathons, teams, and submissions">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Hackathon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Hackathon</DialogTitle>
              <DialogDescription>Fill in the details to create a new hackathon event.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="Enter hackathon name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input id="description" placeholder="Brief description of the hackathon" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="text-right">
                  Start Date
                </Label>
                <Input id="start-date" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right">
                  End Date
                </Label>
                <Input id="end-date" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input id="location" placeholder="Venue or 'Virtual'" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Virtual Event</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox id="virtual" />
                  <label
                    htmlFor="virtual"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    This is a virtual event
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Hackathon</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <Tabs defaultValue="hackathons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hackathons">
            <Calendar className="mr-2 h-4 w-4" />
            Hackathons
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Users className="mr-2 h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="submissions">
            <FileText className="mr-2 h-4 w-4" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Settings className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hackathons" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search hackathons..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {hackathons.map((hackathon) => (
              <Collapsible
                key={hackathon.id}
                open={expandedHackathon === hackathon.id}
                onOpenChange={() => toggleHackathon(hackathon.id)}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{hackathon.name}</CardTitle>
                        <CardDescription>
                          {hackathon.startDate} - {hackathon.endDate}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            hackathon.status === "upcoming"
                              ? "outline"
                              : hackathon.status === "active"
                                ? "default"
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {hackathon.status}
                        </Badge>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {expandedHackathon === hackathon.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{hackathon.participants} participants</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{hackathon.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{hackathon.registrationDeadline}</span>
                      </div>
                    </div>

                    <CollapsibleContent className="mt-4 space-y-4">
                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-medium mb-2">Teams</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Registered Teams</span>
                              <span className="font-medium">{hackathon.stats.teams}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Pending Approval</span>
                              <Badge variant="outline">{hackathon.stats.pendingTeams}</Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Submissions</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Total Submissions</span>
                              <span className="font-medium">{hackathon.stats.submissions}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Judged</span>
                              <span className="font-medium">{hackathon.stats.judgedSubmissions}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Judges</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Assigned Judges</span>
                              <span className="font-medium">{hackathon.stats.judges}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Active Judges</span>
                              <span className="font-medium">{hackathon.stats.activeJudges}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hackathons/admin/hackathons/${hackathon.id}`}>
                            <Settings className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hackathons/admin/hackathons/${hackathon.id}/teams`}>
                            <Users className="mr-2 h-4 w-4" />
                            View Teams
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hackathons/admin/hackathons/${hackathon.id}/submissions`}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Submissions
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hackathons/admin/hackathons/${hackathon.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-500"
                          onClick={() => handleDeleteHackathon(hackathon.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Link href={`/hackathons/${hackathon.id}`} className="text-sm text-primary hover:underline">
                      View public page
                    </Link>
                  </CardFooter>
                </Card>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search teams..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Approve or reject team registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={team.name} />
                        <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {team.hackathon} • {team.members} members
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {team.status === "pending" ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleApproveTeam(team.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-500"
                            onClick={() => handleRejectTeam(team.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge variant={team.status === "approved" ? "outline" : "secondary"} className="capitalize">
                          {team.status}
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/hackathons/teams/${team.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search submissions..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Submissions</CardTitle>
              <CardDescription>Review and manage hackathon project submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{submission.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {submission.team} • {submission.hackathon}
                        </div>
                        <div className="text-xs text-muted-foreground">Submitted on {submission.submittedAt}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={submission.status === "pending" ? "outline" : "secondary"} className="capitalize">
                        {submission.status === "pending" ? "Pending Review" : "Reviewed"}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/hackathons/judge?submission=${submission.id}`}>Review</Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/hackathons/projects/${submission.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hackathon Analytics</CardTitle>
              <CardDescription>Overview of participation and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Participation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Participants</span>
                        <span className="font-medium">487</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Teams</span>
                        <span className="font-medium">98</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Team Size</span>
                        <span className="font-medium">4.2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Submissions</span>
                        <span className="font-medium">82</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Submission Rate</span>
                        <span className="font-medium">83.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Score</span>
                        <span className="font-medium">3.8/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Workshop Attendance</span>
                        <span className="font-medium">76%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Mentor Sessions</span>
                        <span className="font-medium">124</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Comments & Feedback</span>
                        <span className="font-medium">356</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4">Hackathon Comparison</h3>
                <div className="border rounded-md p-4">
                  <div className="text-center text-muted-foreground">Analytics visualization would appear here</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Analytics
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

// Sample data
const hackathons = [
  {
    id: "1",
    name: "AI Solutions Hackathon",
    startDate: "April 15, 2025",
    endDate: "April 16, 2025",
    location: "Innovation Center, Accra",
    participants: 120,
    duration: "2 days",
    registrationDeadline: "Registration closes April 10",
    status: "upcoming",
    stats: {
      teams: 24,
      pendingTeams: 5,
      submissions: 0,
      judgedSubmissions: 0,
      judges: 8,
      activeJudges: 8,
    },
  },
  {
    id: "2",
    name: "FinTech Innovation Challenge",
    startDate: "May 10, 2025",
    endDate: "May 12, 2025",
    location: "Virtual",
    participants: 85,
    duration: "3 days",
    registrationDeadline: "Registration closes May 5",
    status: "upcoming",
    stats: {
      teams: 17,
      pendingTeams: 3,
      submissions: 0,
      judgedSubmissions: 0,
      judges: 6,
      activeJudges: 6,
    },
  },
  {
    id: "3",
    name: "Mobile Health Solutions",
    startDate: "March 10, 2025",
    endDate: "March 17, 2025",
    location: "Virtual",
    participants: 95,
    duration: "1 week",
    registrationDeadline: "Registration closed",
    status: "active",
    stats: {
      teams: 19,
      pendingTeams: 0,
      submissions: 0,
      judgedSubmissions: 0,
      judges: 7,
      activeJudges: 5,
    },
  },
  {
    id: "4",
    name: "EdTech Innovation Challenge",
    startDate: "January 15, 2025",
    endDate: "January 17, 2025",
    location: "Tech Hub, Accra",
    participants: 75,
    duration: "3 days",
    registrationDeadline: "Registration closed",
    status: "past",
    stats: {
      teams: 15,
      pendingTeams: 0,
      submissions: 12,
      judgedSubmissions: 12,
      judges: 5,
      activeJudges: 5,
    },
  },
]

const teams = [
  {
    id: "1",
    name: "Code Wizards",
    hackathon: "AI Solutions Hackathon",
    members: 3,
    status: "pending",
  },
  {
    id: "2",
    name: "Tech Innovators",
    hackathon: "AI Solutions Hackathon",
    members: 5,
    status: "approved",
  },
  {
    id: "3",
    name: "Data Pioneers",
    hackathon: "FinTech Innovation Challenge",
    members: 4,
    status: "pending",
  },
  {
    id: "4",
    name: "Mobile Masters",
    hackathon: "Mobile Health Solutions",
    members: 3,
    status: "approved",
  },
  {
    id: "5",
    name: "AI Visionaries",
    hackathon: "AI Solutions Hackathon",
    members: 2,
    status: "rejected",
  },
]

const submissions = [
  {
    id: "1",
    name: "AI Health Assistant",
    team: "Code Wizards",
    hackathon: "Mobile Health Solutions",
    submittedAt: "March 15, 2025",
    status: "pending",
  },
  {
    id: "2",
    name: "FinTrack",
    team: "Tech Innovators",
    hackathon: "FinTech Innovation Challenge",
    submittedAt: "May 12, 2025",
    status: "pending",
  },
  {
    id: "3",
    name: "LearnSmart",
    team: "Education Innovators",
    hackathon: "EdTech Innovation Challenge",
    submittedAt: "January 17, 2025",
    status: "reviewed",
  },
  {
    id: "4",
    name: "ClassConnect",
    team: "Tech Educators",
    hackathon: "EdTech Innovation Challenge",
    submittedAt: "January 17, 2025",
    status: "reviewed",
  },
]
