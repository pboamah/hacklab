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
import SkillsInput from "@/components/skills-input"
import SocialMediaInputs from "@/components/social-media-inputs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useProfileStore } from "@/lib/store/root-store"

const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    })
    .optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  currentJobRole: z.string().optional(),
  currentWorkplace: z.string().optional(),
  favoriteProgrammingLanguage: z.string().optional(),
  favoriteTechStack: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function CompleteProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const profileStore = useProfileStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [social, setSocial] = useState<{ website?: string; twitter?: string; linkedin?: string; github?: string }>({})

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      bio: "",
      location: "",
      title: "",
      currentJobRole: "",
      currentWorkplace: "",
      favoriteProgrammingLanguage: "",
      favoriteTechStack: "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)

    try {
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Construct profile data
      const profileData = {
        full_name: data.fullName,
        bio: data.bio,
        location: data.location,
        title: data.title,
        skills: skills,
        social: social,
        current_job_role: data.currentJobRole,
        currentWorkplace: data.currentWorkplace,
        favorite_programming_language: data.favoriteProgrammingLanguage,
        favorite_tech_stack: data.favoriteTechStack,
      }

      // Call the updateProfile method in profileStore
      await profileStore.updateProfile(user.id, profileData)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">Tell us more about yourself to personalize your experience.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormDescription>Your current role or profession.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentJobRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Job Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Developer" {...field} />
                  </FormControl>
                  <FormDescription>Your current job role.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentWorkplace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Workplace</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Google" {...field} />
                  </FormControl>
                  <FormDescription>Your current company or workplace.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    Brief description about yourself. This will be visible on your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="San Francisco, CA" {...field} />
                  </FormControl>
                  <FormDescription>Your current location.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="favoriteProgrammingLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite Programming Language</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., JavaScript" {...field} />
                  </FormControl>
                  <FormDescription>Your favorite programming language.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="favoriteTechStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite Tech Stack</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React, Node.js, PostgreSQL" {...field} />
                  </FormControl>
                  <FormDescription>Your favorite tech stack.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Skills</h3>
                <p className="text-sm text-muted-foreground">Add skills to showcase your expertise.</p>
              </div>
              <SkillsInput value={skills} onChange={setSkills} />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Social Media</h3>
                <p className="text-sm text-muted-foreground">Connect your social media accounts.</p>
              </div>
              <SocialMediaInputs values={social} onChange={setSocial} />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
