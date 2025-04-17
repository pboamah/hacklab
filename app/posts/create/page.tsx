"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RichTextEditor } from "@/components/rich-text-editor"
import { EnhancedFileUploader } from "@/components/enhanced-file-uploader"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { uploadPostImage } from "@/lib/storage"

const postFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  communityId: z.string().optional(),
})

type PostFormValues = z.infer<typeof postFormSchema>

export default function CreatePostPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [communities, setCommunities] = useState([])

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
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

  async function onSubmit(data: PostFormValues) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // First create the post to get an ID
      const createResponse = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          authorId: user.id,
          communityId: data.communityId || null,
        }),
      })

      if (!createResponse.ok) {
        throw new Error("Failed to create post")
      }

      const { post } = await createResponse.json()

      // Upload image if selected
      if (imageFile && post.id) {
        setIsUploading(true)
        const { url, error } = await uploadPostImage(imageFile, post.id)
        setIsUploading(false)

        if (error) {
          throw new Error("Failed to upload post image")
        }

        if (url) {
          // Update post with image URL
          const updateResponse = await fetch(`/api/posts/${post.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageUrl: url,
            }),
          })

          if (!updateResponse.ok) {
            throw new Error("Failed to update post with image")
          }
        }
      }

      toast({
        title: "Post created",
        description: "Your post has been created successfully.",
      })

      router.push(data.communityId ? `/communities/${data.communityId}` : "/dashboard")
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Post" text="Share your thoughts with the community" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title for your post" {...field} />
                </FormControl>
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
                  <FormDescription>
                    Choose a community to post in, or leave blank to post to your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <EnhancedFileUploader
            label="Post Image (Optional)"
            description="Upload an image for your post"
            buttonText="Upload Image"
            accept="image/*"
            maxSize={2}
            onFileSelect={(file) => setImageFile(file)}
            isUploading={isUploading}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write your post content here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? "Creating..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </Form>
    </DashboardShell>
  )
}
