"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, UserPlus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardShell from "@/components/dashboard-shell"

// Mock data for members
const members = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Admin",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "Jan 15, 2023",
    status: "active",
    skills: ["React", "TypeScript", "UI/UX"],
  },
  {
    id: "2",
    name: "Sam Wilson",
    role: "Moderator",
    email: "sam@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "Feb 3, 2023",
    status: "active",
    skills: ["Python", "Data Science", "Machine Learning"],
  },
  {
    id: "3",
    name: "Jamie Smith",
    role: "Member",
    email: "jamie@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "Mar 22, 2023",
    status: "inactive",
    skills: ["JavaScript", "Node.js", "MongoDB"],
  },
  {
    id: "4",
    name: "Taylor Brown",
    role: "Member",
    email: "taylor@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "Apr 10, 2023",
    status: "active",
    skills: ["Java", "Spring Boot", "AWS"],
  },
  {
    id: "5",
    name: "Morgan Lee",
    role: "Member",
    email: "morgan@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "May 5, 2023",
    status: "pending",
    skills: ["Flutter", "Dart", "Mobile Development"],
  },
]

export default function MembersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // Filter members based on search query and filters
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRole ? member.role.toLowerCase() === selectedRole.toLowerCase() : true
    const matchesStatus = selectedStatus ? member.status === selectedStatus : true

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <DashboardShell>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community Members</h1>
            <p className="text-muted-foreground">View and manage members of your community</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push("/communities/invite")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Members
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>You have {members.length} members in your community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select onValueChange={(value) => setSelectedRole(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setSelectedStatus(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Members</TabsTrigger>
                <TabsTrigger value="admins">Admins</TabsTrigger>
                <TabsTrigger value="moderators">Moderators</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="m-0">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                          <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">
                            Join Date
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium hidden lg:table-cell">Skills</th>
                          <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredMembers.map((member) => (
                          <tr
                            key={member.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-sm text-muted-foreground">{member.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                variant={
                                  member.role === "Admin"
                                    ? "default"
                                    : member.role === "Moderator"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {member.role}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle hidden md:table-cell">{member.joinDate}</td>
                            <td className="p-4 align-middle hidden md:table-cell">
                              <Badge
                                variant={
                                  member.status === "active"
                                    ? "success"
                                    : member.status === "pending"
                                      ? "warning"
                                      : "destructive"
                                }
                              >
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle hidden lg:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {member.skills.slice(0, 2).map((skill) => (
                                  <Badge key={skill} variant="outline" className="mr-1">
                                    {skill}
                                  </Badge>
                                ))}
                                {member.skills.length > 2 && (
                                  <Badge variant="outline">+{member.skills.length - 2}</Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-4 align-middle text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="admins" className="m-0">
                {/* Similar table structure for admins only */}
              </TabsContent>

              <TabsContent value="moderators" className="m-0">
                {/* Similar table structure for moderators only */}
              </TabsContent>

              <TabsContent value="pending" className="m-0">
                {/* Similar table structure for pending members */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
