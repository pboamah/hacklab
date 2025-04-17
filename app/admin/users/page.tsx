"use client"

import type React from "react"

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
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminLayout } from "@/components/admin-layout"
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

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
  }

  const handleDeleteUser = (userId: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      })
    }, 1000)
  }

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to perform this action.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: `${action} successful`,
        description: `${action} performed on ${selectedUsers.length} users.`,
      })
      setSelectedUsers([])
    }, 1000)
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowAddUserDialog(false)
      toast({
        title: "User added",
        description: "The user has been added successfully.",
      })
    }, 1000)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AdminLayout>
      <DashboardHeader heading="User Management" text="Manage users and their permissions">
        <div className="flex items-center gap-2">
          <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account. They will receive an email to set their password.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" placeholder="Full name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" placeholder="Email address" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select defaultValue="user">
                      <SelectTrigger id="role" className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add User"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage all users on the platform</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="moderator">Moderators</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedUsers.length > 0 && (
            <div className="flex items-center justify-between bg-muted p-2 rounded-md mb-4">
              <span className="text-sm">{selectedUsers.length} users selected</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Export")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Verify")}>
                  <Check className="mr-2 h-4 w-4" />
                  Verify
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
                <Button variant="ghost" size="sm" onClick={() => setSelectedUsers([])}>
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
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">Joined {user.joinedDate}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : user.role === "moderator" ? "outline" : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "active" ? "outline" : "secondary"}
                          className={
                            user.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : user.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {user.status}
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
                              <Link href={`/admin/users/${user.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
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
            Showing {filteredUsers.length} of {users.length} users
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
    </AdminLayout>
  )
}

// Sample data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32&text=JD",
    joinedDate: "Jan 15, 2025",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "moderator",
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32&text=JS",
    joinedDate: "Feb 3, 2025",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    role: "user",
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32&text=MJ",
    joinedDate: "Feb 10, 2025",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "user",
    status: "pending",
    avatar: "/placeholder.svg?height=32&width=32&text=SW",
    joinedDate: "Mar 5, 2025",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "user",
    status: "suspended",
    avatar: "/placeholder.svg?height=32&width=32&text=DB",
    joinedDate: "Jan 20, 2025",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "moderator",
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32&text=ED",
    joinedDate: "Feb 15, 2025",
  },
  {
    id: "7",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    role: "user",
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32&text=RW",
    joinedDate: "Mar 1, 2025",
  },
  {
    id: "8",
    name: "Lisa Taylor",
    email: "lisa.taylor@example.com",
    role: "user",
    status: "active",
    avatar: "/placeholder.svg?height=32&width=32&text=LT",
    joinedDate: "Mar 10, 2025",
  },
]
