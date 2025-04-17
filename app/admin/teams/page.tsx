"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
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
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminTeamsPage() {
  const { toast } = useToast()
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const handleSelectTeam = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId))
    } else {
      setSelectedTeams([...selectedTeams, teamId])
    }
  }

  const handleSelectAll = () => {
    if (selectedTeams.length === teams.length) {
      setSelectedTeams([])
    } else {
      setSelectedTeams(teams.map((team) => team.id))
    }
  }

  const handleDeleteTeam = (teamId: string) => {
    toast({
      title: "Team deleted",
      description: "The team has been deleted successfully.",
    })
  }

  const handleBulkAction = (action: string) => {
    if (selectedTeams.length === 0) {
      toast({
        title: "No teams selected",
        description: "Please select at least one team to perform this action.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: `${action} successful`,
      description: `${action} performed on ${selectedTeams.length} teams.`,
    })

    setSelectedTeams([])
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.hackathon.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardShell>
      <DashboardHeader heading="Team Management" text="Manage hackathon teams and participants">
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/hackathons/teams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Teams</CardTitle>
              <CardDescription>Manage all teams across hackathons</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams..."
                  className="pl-10 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by hackathon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hackathons</SelectItem>
                  <SelectItem value="ai">AI Solutions</SelectItem>
                  <SelectItem value="fintech">FinTech Innovation</SelectItem>
                  <SelectItem value="mobile">Mobile Health</SelectItem>
                  <SelectItem value="edtech">EdTech Innovation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedTeams.length > 0 && (
            <div className="flex items-center justify-between bg-muted p-2 rounded-md mb-4">
              <span className="text-sm">{selectedTeams.length} teams selected</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Export")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Approve")}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-500"
                  onClick={() => handleBulkAction("Delete")}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTeams([])}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedTeams.length === teams.length && teams.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Hackathon</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No teams found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTeams.includes(team.id)}
                          onCheckedChange={() => handleSelectTeam(team.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{team.name}</div>
                      </TableCell>
                      <TableCell>{team.hackathon}</TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {team.members.map((member, i) => (
                            <Avatar key={i} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {team.members.length < team.maxMembers && (
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background text-xs">
                              +{team.maxMembers - team.members.length}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            team.status === "forming" ? "outline" : team.status === "complete" ? "secondary" : "default"
                          }
                          className="capitalize"
                        >
                          {team.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/hackathons/teams/${team.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Team
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              Manage Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {team.status === "pending" && (
                              <DropdownMenuItem>
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteTeam(team.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTeams.length} of {teams.length} teams
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronUp className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}

// Sample data
const teams = [
  {
    id: "1",
    name: "Code Wizards",
    hackathon: "AI Solutions Hackathon",
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32&text=JD" },
      { name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32&text=JS" },
      { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32&text=AJ" },
    ],
    maxMembers: 5,
    status: "forming",
  },
  {
    id: "2",
    name: "Tech Innovators",
    hackathon: "AI Solutions Hackathon",
    members: [
      { name: "Michael Chen", avatar: "/placeholder.svg?height=32&width=32&text=MC" },
      { name: "Sarah Lee", avatar: "/placeholder.svg?height=32&width=32&text=SL" },
      { name: "David Kim", avatar: "/placeholder.svg?height=32&width=32&text=DK" },
      { name: "Emily Wong", avatar: "/placeholder.svg?height=32&width=32&text=EW" },
      { name: "James Wilson", avatar: "/placeholder.svg?height=32&width=32&text=JW" },
    ],
    maxMembers: 5,
    status: "complete",
  },
  {
    id: "3",
    name: "Data Pioneers",
    hackathon: "FinTech Innovation Challenge",
    members: [
      { name: "Priya Patel", avatar: "/placeholder.svg?height=32&width=32&text=PP" },
      { name: "Omar Hassan", avatar: "/placeholder.svg?height=32&width=32&text=OH" },
      { name: "Maria Garcia", avatar: "/placeholder.svg?height=32&width=32&text=MG" },
      { name: "Robert Chen", avatar: "/placeholder.svg?height=32&width=32&text=RC" },
    ],
    maxMembers: 5,
    status: "complete",
  },
  {
    id: "4",
    name: "Mobile Masters",
    hackathon: "Mobile Health Solutions",
    members: [
      { name: "Lisa Johnson", avatar: "/placeholder.svg?height=32&width=32&text=LJ" },
      { name: "Kevin Park", avatar: "/placeholder.svg?height=32&width=32&text=KP" },
      { name: "Sophia Rodriguez", avatar: "/placeholder.svg?height=32&width=32&text=SR" },
    ],
    maxMembers: 5,
    status: "submitted",
  },
  {
    id: "5",
    name: "AI Visionaries",
    hackathon: "AI Solutions Hackathon",
    members: [
      { name: "Thomas Lee", avatar: "/placeholder.svg?height=32&width=32&text=TL" },
      { name: "Aisha Khan", avatar: "/placeholder.svg?height=32&width=32&text=AK" },
    ],
    maxMembers: 5,
    status: "forming",
  },
  {
    id: "6",
    name: "EdTech Innovators",
    hackathon: "EdTech Innovation Challenge",
    members: [
      { name: "Daniel Brown", avatar: "/placeholder.svg?height=32&width=32&text=DB" },
      { name: "Emma Wilson", avatar: "/placeholder.svg?height=32&width=32&text=EW" },
      { name: "Noah Martinez", avatar: "/placeholder.svg?height=32&width=32&text=NM" },
      { name: "Olivia Taylor", avatar: "/placeholder.svg?height=32&width=32&text=OT" },
    ],
    maxMembers: 5,
    status: "submitted",
  },
  {
    id: "7",
    name: "Blockchain Builders",
    hackathon: "FinTech Innovation Challenge",
    members: [
      { name: "William Johnson", avatar: "/placeholder.svg?height=32&width=32&text=WJ" },
      { name: "Sophia Chen", avatar: "/placeholder.svg?height=32&width=32&text=SC" },
      { name: "Ethan Davis", avatar: "/placeholder.svg?height=32&width=32&text=ED" },
    ],
    maxMembers: 5,
    status: "forming",
  },
  {
    id: "8",
    name: "Health Innovators",
    hackathon: "Mobile Health Solutions",
    members: [
      { name: "Isabella Moore", avatar: "/placeholder.svg?height=32&width=32&text=IM" },
      { name: "Lucas Garcia", avatar: "/placeholder.svg?height=32&width=32&text=LG" },
      { name: "Mia Robinson", avatar: "/placeholder.svg?height=32&width=32&text=MR" },
      { name: "Jacob Lee", avatar: "/placeholder.svg?height=32&width=32&text=JL" },
      { name: "Ava Thompson", avatar: "/placeholder.svg?height=32&width=32&text=AT" },
    ],
    maxMembers: 5,
    status: "submitted",
  },
]
