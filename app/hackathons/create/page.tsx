"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileUploader } from "@/components/file-uploader"
import { DashboardShell } from "@/components/dashboard-shell"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { getBrowserClient } from "@/lib/supabase"

const hackathonFormSchema = z
  .object({
    name: z.string().min(3, "Hackathon name must be at least 3 characters"),
    description: z.string().min(10, "Please provide a detailed description"),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
    location: z.string().optional(),
    isVirtual: z.boolean().default(false),
    prizes: z.string().optional(),
    rules: z.string().optional(),
    criteria: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })

type HackathonFormValues = z.infer<typeof hackathonFormSchema>

interface ScheduleItem {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
}

export default function CreateHackathonPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [speakers, setSpeakers] = useState<{ id: string; name: string; role?: string }[]>([])

  const form = useForm<HackathonFormValues>({
    resolver: zodResolver(hackathonFormSchema),
    defaultValues: {
      name: "",
      description: "",
      isVirtual: false,
      location: "",
      prizes: "",
      rules: "",
      criteria: "",
    },
  })

  const onSubmit = async (data: HackathonFormValues) => {
    setIsSubmitting(true)

    try {
      const supabase = getBrowserClient()

      // Create event first
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .insert({
          name: data.name,
          description: data.description,
          start_date: data.startDate.toISOString(),
          end_date: data.endDate.toISOString(),
          location: data.location,
          is_virtual: data.isVirtual,
          image: image,
          organizer_id: "current-user-id", // In a real app, this would be the current user's ID
          type: "hackathon",
        })
        .select()

      if (eventError) throw eventError

      if (eventData && eventData[0]) {
        // Create hackathon with event ID
        const { error: hackathonError } = await supabase.from("hackathons").insert({
          event_id: eventData[0].id,
          prizes: data.prizes,
          rules: data.rules,
          criteria: data.criteria,
        })

        if (hackathonError) throw hackathonError

        // Add schedule items if any
        if (schedule.length > 0) {
          const scheduleItems = schedule.map((item) => ({
            event_id: eventData[0].id,
            title: item.title,
            description: item.description,
            start_time: item.startTime.toISOString(),
            end_time: item.endTime.toISOString(),
          }))

          const { error: scheduleError } = await supabase.from("event_schedule").insert(scheduleItems)

          if (scheduleError) throw scheduleError
        }

        // Add speakers if any
        if (speakers.length > 0) {
          const speakerItems = speakers.map((speaker) => ({
            event_id: eventData[0].id,
            name: speaker.name,
            role: speaker.role,
          }))

          const { error: speakersError } = await supabase.from("event_speakers").insert(speakerItems)

          if (speakersError) throw speakersError
        }

        router.push("/hackathons")
        router.refresh()
      }
    } catch (error) {
      console.error("Error creating hackathon:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (url: string) => {
    setImage(url)
  }

  const addScheduleItem = () => {
    const startTime = new Date()
    const endTime = new Date(startTime)
    endTime.setHours(endTime.getHours() + 1)

    setSchedule([
      ...schedule,
      {
        id: `schedule-${Date.now()}`,
        title: "",
        description: "",
        startTime,
        endTime,
      },
    ])
  }

  const updateScheduleItem = (id: string, field: string, value: any) => {
    setSchedule(schedule.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const removeScheduleItem = (id: string) => {
    setSchedule(schedule.filter((item) => item.id !== id))
  }

  const addSpeaker = () => {
    setSpeakers([
      ...speakers,
      {
        id: `speaker-${Date.now()}`,
        name: "",
        role: "",
      },
    ])
  }

  const updateSpeaker = (id: string, field: string, value: string) => {
    setSpeakers(speakers.map((speaker) => (speaker.id === id ? { ...speaker, [field]: value } : speaker)))
  }

  const removeSpeaker = (id: string) => {
    setSpeakers(speakers.filter((speaker) => speaker.id !== id))
  }

  return (
    <DashboardShell>
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Create a Hackathon</CardTitle>
            <CardDescription>Set up a new hackathon event for the community</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hackathon Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. AI Solutions Hackathon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the hackathon, its goals, and what participants can expect..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Innovation Center, Accra" {...field} />
                        </FormControl>
                        <FormDescription>Leave blank if this is a virtual-only event</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isVirtual"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Virtual Event</FormLabel>
                          <FormDescription>Is this a virtual hackathon?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <FormLabel>Cover Image</FormLabel>
                  <FileUploader onUploadComplete={handleImageUpload} fileType="image" maxSize={5} />
                  {image && (
                    <div className="mt-2">
                      <img
                        src={image || "/placeholder.svg"}
                        alt="Cover preview"
                        className="h-40 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="prizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prizes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the prizes and rewards for winners..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rules</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List the rules and guidelines for participants..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="criteria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judging Criteria</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain how projects will be judged..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Schedule</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addScheduleItem}>
                      <Plus className="h-4 w-4 mr-2" /> Add Schedule Item
                    </Button>
                  </div>

                  {schedule.map((item, index) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Schedule Item {index + 1}</h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeScheduleItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <FormLabel>Title</FormLabel>
                            <Input
                              value={item.title}
                              onChange={(e) => updateScheduleItem(item.id, "title", e.target.value)}
                              placeholder="e.g. Opening Ceremony"
                            />
                          </div>

                          <div>
                            <FormLabel>Description (Optional)</FormLabel>
                            <Textarea
                              value={item.description}
                              onChange={(e) => updateScheduleItem(item.id, "description", e.target.value)}
                              placeholder="Brief description of this schedule item..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <FormLabel>Start Time</FormLabel>
                              <Input
                                type="datetime-local"
                                value={format(item.startTime, "yyyy-MM-dd'T'HH:mm")}
                                onChange={(e) => {
                                  const date = e.target.value ? new Date(e.target.value) : new Date()
                                  updateScheduleItem(item.id, "startTime", date)
                                }}
                              />
                            </div>

                            <div>
                              <FormLabel>End Time</FormLabel>
                              <Input
                                type="datetime-local"
                                value={format(item.endTime, "yyyy-MM-dd'T'HH:mm")}
                                onChange={(e) => {
                                  const date = e.target.value ? new Date(e.target.value) : new Date()
                                  updateScheduleItem(item.id, "endTime", date)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Speakers/Judges</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addSpeaker}>
                      <Plus className="h-4 w-4 mr-2" /> Add Speaker
                    </Button>
                  </div>

                  {speakers.map((speaker, index) => (
                    <Card key={speaker.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Speaker {index + 1}</h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeSpeaker(speaker.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Name</FormLabel>
                          <Input
                            value={speaker.name}
                            onChange={(e) => updateSpeaker(speaker.id, "name", e.target.value)}
                            placeholder="Speaker's name"
                          />
                        </div>

                        <div>
                          <FormLabel>Role</FormLabel>
                          <Input
                            value={speaker.role}
                            onChange={(e) => updateSpeaker(speaker.id, "role", e.target.value)}
                            placeholder="e.g. Judge, Mentor, Speaker"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Hackathon"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
