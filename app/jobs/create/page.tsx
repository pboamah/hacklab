"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { FileUploader } from "@/components/file-uploader"
import { DashboardShell } from "@/components/dashboard-shell"
import { jobSchema } from "@/lib/validations/schema"
import { getBrowserClient } from "@/lib/supabase"

type JobFormValues = z.infer<typeof jobSchema>

export default function CreateJobPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      location: "",
      isRemote: false,
      type: "full-time",
      isPaid: true,
      requirements: "",
      externalLink: "",
    },
  })

  const onSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true)

    try {
      const supabase = getBrowserClient()

      const { data: jobData, error } = await supabase
        .from("jobs")
        .insert({
          ...data,
          cover_image: coverImage,
        })
        .select()

      if (error) throw error

      router.push("/jobs")
      router.refresh()
    } catch (error) {
      console.error("Error creating job:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (url: string) => {
    setCoverImage(url)
  }

  return (
    <DashboardShell>
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>Create a new job listing for the community</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Accra, Ghana" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="isRemote"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Remote Position</FormLabel>
                          <FormDescription>Is this a remote job position?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPaid"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Paid Position</FormLabel>
                          <FormDescription>Is this a paid job position?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("isPaid") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 50000"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salaryMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 70000"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the job role, responsibilities, and company..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List the skills, qualifications, and experience required..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="externalLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>External Application Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://company.com/careers/job-id" {...field} />
                      </FormControl>
                      <FormDescription>
                        If you want applicants to apply on your website, provide the link here
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Cover Image (Optional)</FormLabel>
                  <FileUploader onUploadComplete={handleImageUpload} fileType="image" maxSize={5} />
                  {coverImage && (
                    <div className="mt-2">
                      <img
                        src={coverImage || "/placeholder.svg"}
                        alt="Cover preview"
                        className="h-40 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Job Listing"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
