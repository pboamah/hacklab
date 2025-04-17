"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function JudgeSchedulePage() {
  const { toast } = useToast()
  const [currentMonth, setCurrentMonth] = useState("April 2025")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const handlePreviousMonth = () => {
    setCurrentMonth("March 2025")
  }

  const handleNextMonth = () => {
    setCurrentMonth("May 2025")
  }

  const handleSelectDate = (date: string) => {
    setSelectedDate(date === selectedDate ? null : date)
  }

  const handleAddEvent = () => {
    toast({
      title: "Event added",
      description: "The judging session has been added to your schedule.",
    })
  }

  const handleExportSchedule = () => {
    toast({
      title: "Schedule exported",
      description: "Your judging schedule has been exported successfully.",
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Judging Schedule" text="Manage your judging sessions and availability">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportSchedule}>
            <Download className="mr-2 h-4 w-4" />
            Export Schedule
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Judging Session</DialogTitle>
                <DialogDescription>
                  Schedule a new judging session or block time for reviewing submissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="session-title" className="text-right">
                    Title
                  </Label>
                  <Input id="session-title" placeholder="Enter session title" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="session-date" className="text-right">
                    Date
                  </Label>
                  <Input id="session-date" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start-time" className="text-right">
                    Start Time
                  </Label>
                  <Input id="start-time" type="time" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end-time" className="text-right">
                    End Time
                  </Label>
                  <Input id="end-time" type="time" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hackathon" className="text-right">
                    Hackathon
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select hackathon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI Solutions Hackathon</SelectItem>
                      <SelectItem value="fintech">FinTech Innovation Challenge</SelectItem>
                      <SelectItem value="mobile">Mobile Health Solutions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="session-type" className="text-right">
                    Session Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="review">Submission Review</SelectItem>
                      <SelectItem value="presentation">Team Presentations</SelectItem>
                      <SelectItem value="deliberation">Judges Deliberation</SelectItem>
                      <SelectItem value="unavailable">Unavailable Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea id="notes" placeholder="Add any additional notes" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddEvent}>
                  Add to Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{currentMonth}</span>
                  <Button variant="outline" size="icon" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-sm py-2">
                    {day}
                  </div>
                ))}
                {/* Empty cells for days before the 1st */}
                {[...Array(3)].map((_, i) => (
                  <div key={`empty-start-${i}`} className="h-24 border rounded-md bg-muted/20"></div>
                ))}
                {/* Calendar days */}
                {[...Array(30)].map((_, i) => {
                  const day = i + 1
                  const date = `April ${day}, 2025`
                  const isSelected = selectedDate === date
                  const hasEvents = calendarEvents.some((event) => event.date === date)

                  return (
                    <div
                      key={`day-${day}`}
                      className={`h-24 border rounded-md p-1 cursor-pointer transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : hasEvents ? "border-primary/30" : ""
                      }`}
                      onClick={() => handleSelectDate(date)}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>{day}</span>
                        {hasEvents && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                      </div>
                      <div className="mt-1 space-y-1">
                        {calendarEvents
                          .filter((event) => event.date === date)
                          .slice(0, 2)
                          .map((event, eventIndex) => (
                            <div
                              key={`event-${day}-${eventIndex}`}
                              className="text-xs p-1 rounded-sm truncate"
                              style={{
                                backgroundColor:
                                  event.type === "review"
                                    ? "rgba(var(--primary), 0.1)"
                                    : event.type === "presentation"
                                      ? "rgba(59, 130, 246, 0.1)"
                                      : "rgba(249, 115, 22, 0.1)",
                                color:
                                  event.type === "review"
                                    ? "hsl(var(--primary))"
                                    : event.type === "presentation"
                                      ? "rgb(59, 130, 246)"
                                      : "rgb(249, 115, 22)",
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                        {calendarEvents.filter((event) => event.date === date).length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{calendarEvents.filter((event) => event.date === date).length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                {/* Empty cells for days after the 30th */}
                {[...Array(4)].map((_, i) => (
                  <div key={`empty-end-${i}`} className="h-24 border rounded-md bg-muted/20"></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>Events for {selectedDate}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calendarEvents
                    .filter((event) => event.date === selectedDate)
                    .map((event, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 border rounded-md">
                        <div
                          className="rounded-full p-2"
                          style={{
                            backgroundColor:
                              event.type === "review"
                                ? "rgba(var(--primary), 0.1)"
                                : event.type === "presentation"
                                  ? "rgba(59, 130, 246, 0.1)"
                                  : "rgba(249, 115, 22, 0.1)",
                          }}
                        >
                          {event.type === "review" ? (
                            <FileText className="h-5 w-5" style={{ color: "hsl(var(--primary))" }} />
                          ) : event.type === "presentation" ? (
                            <Users className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Users className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{event.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">Cancel</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="mr-1 h-4 w-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Users className="mr-1 h-4 w-4" />
                            {event.participants}
                          </div>
                          {event.location && (
                            <div className="text-sm text-muted-foreground mt-1">Location: {event.location}</div>
                          )}
                        </div>
                      </div>
                    ))}

                  {calendarEvents.filter((event) => event.date === selectedDate).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No events scheduled for this day</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event for {selectedDate.split(",")[0]}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Judging Session</DialogTitle>
                      <DialogDescription>Schedule a new judging session for {selectedDate}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="session-title-selected" className="text-right">
                          Title
                        </Label>
                        <Input id="session-title-selected" placeholder="Enter session title" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start-time-selected" className="text-right">
                          Start Time
                        </Label>
                        <Input id="start-time-selected" type="time" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end-time-selected" className="text-right">
                          End Time
                        </Label>
                        <Input id="end-time-selected" type="time" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="hackathon-selected" className="text-right">
                          Hackathon
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select hackathon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai">AI Solutions Hackathon</SelectItem>
                            <SelectItem value="fintech">FinTech Innovation Challenge</SelectItem>
                            <SelectItem value="mobile">Mobile Health Solutions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="session-type-selected" className="text-right">
                          Session Type
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="review">Submission Review</SelectItem>
                            <SelectItem value="presentation">Team Presentations</SelectItem>
                            <SelectItem value="deliberation">Judges Deliberation</SelectItem>
                            <SelectItem value="unavailable">Unavailable Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddEvent}>
                        Add to Schedule
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div
                    className="rounded-full p-2"
                    style={{
                      backgroundColor:
                        session.type === "review"
                          ? "rgba(var(--primary), 0.1)"
                          : session.type === "presentation"
                            ? "rgba(59, 130, 246, 0.1)"
                            : "rgba(249, 115, 22, 0.1)",
                    }}
                  >
                    {session.type === "review" ? (
                      <FileText className="h-5 w-5" style={{ color: "hsl(var(--primary))" }} />
                    ) : session.type === "presentation" ? (
                      <Users className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Users className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Calendar className="mr-1 h-4 w-4" />
                      {session.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="mr-1 h-4 w-4" />
                      {session.time}
                    </div>
                  </div>
                </div>
              ))}

              {upcomingSessions.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No upcoming sessions</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/hackathons/judge/dashboard">View Pending Reviews</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Hackathons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignedHackathons.map((hackathon, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium">{hackathon.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Calendar className="mr-1 h-4 w-4" />
                      {hackathon.dates}
                    </div>
                  </div>
                  <Badge variant={hackathon.status === "active" ? "default" : "outline"}>{hackathon.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Judging Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {judgingProgress.map((hackathon, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{hackathon.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {hackathon.completed}/{hackathon.total} reviewed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(hackathon.completed / hackathon.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/hackathons/judge/dashboard">Continue Judging</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

// Sample data
const calendarEvents = [
  {
    date: "April 15, 2025",
    title: "Team Presentations",
    time: "10:00 AM - 2:00 PM",
    type: "presentation",
    participants: "12 teams",
    location: "Innovation Center, Room 301",
  },
  {
    date: "April 15, 2025",
    title: "Judges Orientation",
    time: "9:00 AM - 10:00 AM",
    type: "deliberation",
    participants: "All judges",
    location: "Innovation Center, Room 301",
  },
  {
    date: "April 16, 2025",
    title: "Submission Reviews",
    time: "9:00 AM - 12:00 PM",
    type: "review",
    participants: "6 submissions",
  },
  {
    date: "April 16, 2025",
    title: "Judges Deliberation",
    time: "2:00 PM - 4:00 PM",
    type: "deliberation",
    participants: "All judges",
    location: "Innovation Center, Room 301",
  },
  {
    date: "April 18, 2025",
    title: "Submission Reviews",
    time: "10:00 AM - 2:00 PM",
    type: "review",
    participants: "8 submissions",
  },
  {
    date: "April 20, 2025",
    title: "Final Scoring Deadline",
    time: "11:59 PM",
    type: "review",
    participants: "All submissions",
  },
  {
    date: "April 10, 2025",
    title: "FinTech Presentations",
    time: "1:00 PM - 5:00 PM",
    type: "presentation",
    participants: "8 teams",
    location: "Virtual",
  },
  {
    date: "April 12, 2025",
    title: "FinTech Deliberation",
    time: "10:00 AM - 12:00 PM",
    type: "deliberation",
    participants: "All judges",
    location: "Virtual",
  },
]

const upcomingSessions = [
  {
    title: "Team Presentations",
    date: "April 15, 2025",
    time: "10:00 AM - 2:00 PM",
    type: "presentation",
  },
  {
    title: "Submission Reviews",
    date: "April 16, 2025",
    time: "9:00 AM - 12:00 PM",
    type: "review",
  },
  {
    title: "Judges Deliberation",
    date: "April 16, 2025",
    time: "2:00 PM - 4:00 PM",
    type: "deliberation",
  },
]

const assignedHackathons = [
  {
    name: "AI Solutions Hackathon",
    dates: "April 15-16, 2025",
    status: "upcoming",
  },
  {
    name: "FinTech Innovation Challenge",
    dates: "May 10-12, 2025",
    status: "upcoming",
  },
  {
    name: "Mobile Health Solutions",
    dates: "March 10-17, 2025",
    status: "active",
  },
]

const judgingProgress = [
  {
    name: "Mobile Health Solutions",
    completed: 8,
    total: 12,
  },
  {
    name: "AI Solutions Hackathon",
    completed: 0,
    total: 24,
  },
  {
    name: "FinTech Innovation Challenge",
    completed: 0,
    total: 17,
  },
]
