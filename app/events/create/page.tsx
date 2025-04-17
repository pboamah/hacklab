"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EnhancedFileUploader } from "@/components/enhanced-file-uploader"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { uploadEventImage } from "@/lib/storage"

const eventFormSchema = z.object({
  title: z.string().min(3, {
    message: "Event title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  startDate: z.string({
    required_error: "Start date is required.",
  }),
  startTime: z.string({
    required_error: "Start time is required.",
  }),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  isVirtual: z.boolean().default(false),
  maxAttendees: z.string().optional(),
  category: z.string().optional(),
  communityId: z.string().optional(),
})

type EventFormValues = z.infer<typeof eventFormSchema>

export default function CreateEventPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [communities, setCommunities] = useState([])

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
      isVirtual: false,
      maxAttendees: "",
      category: "",
      communityId: "",
    },
  })

  // Fetch user's communities
  useState(() => {
    async function fetchCommunities() {
      if (!user) return

      try {
        const response = await fetch("/api/communities")
        const data = await response.json()
        setCommunities(data.communities || [])
      } catch (error) {
        console.error("Error fetching communities:", error)
      }
    }

    fetchCommunities()
  })

  async function onSubmit(data: EventFormValues) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create an event",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Combine date and time
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`)
      let endDateTime = null

      if (data.endDate && data.endTime) {
        endDateTime = new Date(`${data.endDate}T${data.endTime}`)
      } else if (data.endDate) {
        // If only end date is provided, use start time
        endDateTime = new Date(`${data.endDate}T${data.startTime}`)
      } else if (data.endTime) {
        // If only end time is provided, use start date
        endDateTime = new Date(`${data.startDate}T${data.endTime}`)
      }

      // First create the event to get an ID
      const createResponse = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime ? endDateTime.toISOString() : null,
          location: data.isVirtual ? "Virtual" : data.location,
          isVirtual: data.isVirtual,
          maxAttendees: data.maxAttendees ? Number.parseInt(data.maxAttendees) : null,
          category: data.category,
          communityId: data.communityId || null,
          organizerId: user.id,
        }),
      })

      if (!createResponse.ok) {
        throw new Error("Failed to create event")
      }

      const { event } = await createResponse.json()

      // Upload image if selected
      if (imageFile && event.id) {
        setIsUploading(true)
        const { url, error } = await uploadEventImage(imageFile, event.id)
        setIsUploading(false)

        if (error) {
          throw new Error("Failed to upload event image")
        }

        if (url) {
          // Update event with image URL
          const updateResponse = await fetch(`/api/events/${event.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageUrl: url,
            }),
          })

          if (!updateResponse.ok) {
            throw new Error("Failed to update event with image")
          }
        }
      }

      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      })

      router.push(`/events/${event.id}`)
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Event" text="Create a new event for your community" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6 md:col-span-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Web Development Workshop" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time (Optional)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isVirtual"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Virtual Event</FormLabel>
                      <FormDescription>This event will be held online</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {!form.watch("isVirtual") && (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123 Main St, City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="maxAttendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Attendees (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormDescription>Leave blank for unlimited attendees</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="meetup">Meetup</SelectItem>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {communities.length > 0 && (
                <FormField
                  control={form.control}
                  name="communityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a community" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {communities.map((community: any) => (
                            <SelectItem key={community.id} value={community.id}>
                              {community.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Associate this event with one of your communities</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <EnhancedFileUploader
                label="Event Image"
                description="Upload an image for your event"
                buttonText="Upload Image"
                accept="image/*"
                maxSize={2}
                onFileSelect={(file) => setImageFile(file)}
                isUploading={isUploading}
              />
            </div>

            <div className="md:col-span-1">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your event..." className="min-h-[300px]" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide details about your event, including what attendees can expect, any prerequisites, and any
                      other relevant information.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/events")} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardShell>
  )
}
