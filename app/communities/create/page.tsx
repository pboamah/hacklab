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
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EnhancedFileUploader } from "@/components/enhanced-file-uploader"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { uploadCommunityImage } from "@/lib/storage"

const communityFormSchema = z.object({
  name: z.string().min(3, {
    message: "Community name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  privacy: z.enum(["public", "private"], {
    required_error: "Please select a privacy setting.",
  }),
})

type CommunityFormValues = z.infer<typeof communityFormSchema>

const defaultValues: Partial<CommunityFormValues> = {
  name: "",
  description: "",
  category: "",
  privacy: "public",
}

export default function CreateCommunityPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communityFormSchema),
    defaultValues,
  })

  async function onSubmit(data: CommunityFormValues) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a community",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // First create the community to get an ID
      const createResponse = await fetch("/api/communities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          category: data.category,
          privacy: data.privacy,
          creatorId: user.id,
        }),
      })

      if (!createResponse.ok) {
        throw new Error("Failed to create community")
      }

      const { community } = await createResponse.json()

      // Upload image if selected
      if (imageFile && community.id) {
        setIsUploading(true)
        const { url, error } = await uploadCommunityImage(imageFile, community.id)
        setIsUploading(false)

        if (error) {
          throw new Error("Failed to upload community image")
        }

        if (url) {
          // Update community with image URL
          const updateResponse = await fetch(`/api/communities/${community.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageUrl: url,
            }),
          })

          if (!updateResponse.ok) {
            throw new Error("Failed to update community with image")
          }
        }
      }

      toast({
        title: "Community created",
        description: "Your community has been created successfully.",
      })

      router.push(`/communities/${community.id}`)
    } catch (error) {
      console.error("Error creating community:", error)
      toast({
        title: "Error",
        description: "Failed to create community",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Community" text="Create a new community for people with similar interests" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6 md:col-span-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JavaScript Developers" {...field} />
                    </FormControl>
                    <FormDescription>Choose a clear, descriptive name for your community</FormDescription>
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
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the category that best describes your community</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Privacy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select privacy setting" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can view and join</SelectItem>
                        <SelectItem value="private">Private - Invitation only</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Control who can view and join your community</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <EnhancedFileUploader
                label="Community Image"
                description="Upload a community image or logo"
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
                      <Textarea
                        placeholder="Describe what your community is about..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your community's purpose, goals, and what members can expect
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/communities")} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? "Creating..." : "Create Community"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardShell>
  )
}
