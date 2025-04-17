"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminLayout } from "@/components/admin-layout"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminEventsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAddEventDialog, setShowAddEventDialog] = useState(false)

  const toggleEvent = (id: string) => {
    if (expandedEvent === id) {
      setExpandedEvent(null)
    } else {
      setExpandedEvent(id)
    }
  }

  const handleDeleteEvent = (id: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully.",
      })
    }, 1000)
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowAddEventDialog(false)
      toast({
        title: "Event created",
        description: "The event has been created successfully.",
      })
    }, 1000)
  }

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AdminLayout>
      <DashboardHeader heading="Event Management" text="Manage events across the platform">
        <div className="flex items-center gap-2">
          <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Fill in the details to create a new event.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEvent}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" placeholder="Enter event name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input id="description" placeholder="Brief description of the event" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start-date" className="text-right">
                      Start Date
                    </Label>
                    <Input id="start-date" type="date" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end-date" className="text-right">
                      End Date
                    </Label>
                    <Input id="end-date" type="date" className="col-span-3" required />
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="community" className="text-right">
                      Community
                    </Label>
                    <Select>
                      <SelectTrigger id="community" className="col-span-3">
                        <SelectValue placeholder="Select community" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Tech Enthusiasts</SelectItem>
                        <SelectItem value="design">Design Community</SelectItem>
                        <SelectItem value="business">Business Network</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Event"}
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
              <CardTitle>Events</CardTitle>
              <CardDescription>Manage all events on the platform</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-10 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Collapsible
                key={event.id}
                open={expandedEvent === event.id}
                onOpenChange={() => toggleEvent(event.id)}
                className="border rounded-md"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.startDate} • {event.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        event.status === "upcoming" ? "outline" : event.status === "ongoing" ? "default" : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {expandedEvent === event.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                <CollapsibleContent>
                  <Separator />
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Event Details</h3>
                        <div className="text-sm">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-medium w-24">Organizer:</span>
                            <span>{event.organizer}</span>
                          </div>
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-medium w-24">Date:</span>
                            <span>
                              {event.startDate} to {event.endDate}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-medium w-24">Location:</span>
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-medium w-24">Description:</span>
                            <span className="text-muted-foreground">{event.description}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Attendance</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Registered Attendees</span>
                            <span className="font-medium">{event.attendees}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Capacity</span>
                            <span className="font-medium">{event.capacity}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Attendance Rate</span>
                            <span className="font-medium">{event.attendanceRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/events/${event.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Event
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/events/${event.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Event
                          </Link>
                        </Button>
                      </div>
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
                            <Link href={`/admin/events/${event.id}/attendees`}>
                              <Users className="mr-2 h-4 w-4" />
                              Manage Attendees
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/events/${event.id}/schedule`}>
                              <Clock className="mr-2 h-4 w-4" />
                              Manage Schedule
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No events found</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {events.length} events
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
const events = [
  {
    id: "1",
    name: "Tech Conference 2025",
    description: "Annual technology conference featuring the latest innovations and industry trends.",
    startDate: "June 15, 2025",
    endDate: "June 17, 2025",
    location: "Innovation Center, Accra",
    organizer: "Tech Community Ghana",
    status: "upcoming",
    attendees: 120,
    capacity: 200,
    attendanceRate: 0,
  },
  {
    id: "2",
    name: "Web Development Workshop",
    description: "Hands-on workshop covering modern web development techniques and best practices.",
    startDate: "May 10, 2025",
    endDate: "May 10, 2025",
    location: "Virtual",
    organizer: "Code Academy",
    status: "upcoming",
    attendees: 85,
    capacity: 100,
    attendanceRate: 0,
  },
  {
    id: "3",
    name: "AI Hackathon",
    description: "Competitive event where participants build AI solutions to solve real-world problems.",
    startDate: "April 20, 2025",
    endDate: "April 22, 2025",
    location: "Tech Hub, Accra",
    organizer: "AI Ghana",
    status: "ongoing",
    attendees: 95,
    capacity: 100,
    attendanceRate: 95,
  },
  {
    id: "4",
    name: "Design Thinking Workshop",
    description: "Interactive workshop on applying design thinking principles to product development.",
    startDate: "March 5, 2025",
    endDate: "March 5, 2025",
    location: "Creative Space, Kumasi",
    organizer: "Design Community Ghana",
    status: "past",
    attendees: 45,
    capacity: 50,
    attendanceRate: 90,
  },
  {
    id: "5",
    name: "Startup Networking Event",
    description: "Networking event for startups, investors, and industry professionals.",
    startDate: "February 20, 2025",
    endDate: "February 20, 2025",
    location: "Business Hub, Accra",
    organizer: "Startup Ghana",
    status: "past",
    attendees: 75,
    capacity: 80,
    attendanceRate: 94,
  },
]
