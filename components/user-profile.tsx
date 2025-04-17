"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Camera, Edit, Mail, MapPin, LinkIcon, Github, Twitter, Linkedin } from "lucide-react"
import { useProfileStore, useUserStore, useMessageStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface UserProfileProps {
  userId: string
  isCurrentUser?: boolean
}

export const UserProfile = observer(({ userId, isCurrentUser = false }: UserProfileProps) => {
  const profileStore = useProfileStore()
  const userStore = useUserStore()
  const messageStore = useMessageStore()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
    linkedin: "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    profileStore.fetchProfile(userId)
  }, [profileStore, userId])

  useEffect(() => {
    const profile = profileStore.getProfile(userId)
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.social_links?.website || "",
        github: profile.social_links?.github || "",
        twitter: profile.social_links?.twitter || "",
        linkedin: profile.social_links?.linkedin || "",
      })
    }
  }, [profileStore, userId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    try {
      // Update profile data
      const updateData: any = {
        full_name: formData.full_name,
        title: formData.title,
        bio: formData.bio,
        location: formData.location,
        social_links: {
          website: formData.website,
          github: formData.github,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
        },
      }

      // Upload avatar if changed
      if (avatarFile) {
        await profileStore.uploadAvatar(userId, avatarFile)
      }

      await profileStore.updateProfile(userId, updateData)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStartConversation = () => {
    if (!userId) return
    messageStore.setActiveConversation(userId)
    router.push("/messages")
  }

  const profile = profileStore.getProfile(userId)

  if (profileStore.isLoading && !profile) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-background">
                <AvatarImage
                  src={
                    previewUrl ||
                    profile?.avatar_url ||
                    `/placeholder.svg?height=64&width=64&text=${profile?.full_name?.charAt(0) || "U"}`
                  }
                  alt={profile?.full_name || "User"}
                />
                <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
            <div>
              {isEditing ? (
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="font-semibold text-lg mb-1"
                />
              ) : (
                <CardTitle>{profile?.full_name || "Anonymous User"}</CardTitle>
              )}
              {isEditing ? (
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Your title or role"
                  className="text-sm text-muted-foreground"
                />
              ) : (
                <CardDescription>{profile?.title || "Community Member"}</CardDescription>
              )}
            </div>
          </div>
          {isCurrentUser ? (
            isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={profileStore.isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={profileStore.isLoading}>
                  {profileStore.isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )
          ) : (
            <Button onClick={handleStartConversation}>
              <Mail className="h-4 w-4 mr-2" />
              Message
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isEditing ? (
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-sm">{profile?.bio || "No bio provided."}</p>
          )}

          <div className="flex flex-col gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Your location"
                  className="flex-1"
                />
              </div>
            ) : profile?.location ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.location}</span>
              </div>
            ) : null}

            {isEditing ? (
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Your website"
                  className="flex-1"
                />
              </div>
            ) : profile?.social_links?.website ? (
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <a
                  href={profile.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {profile.social_links.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            ) : null}

            {/* Social media links */}
            <div className="flex gap-2 mt-2">
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <Input
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="GitHub username"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                    <Input
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="Twitter username"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="LinkedIn username"
                      className="w-full"
                    />
                  </div>
                </>
              ) : (
                <>
                  {profile?.social_links?.github && (
                    <a
                      href={`https://github.com/${profile.social_links.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {profile?.social_links?.twitter && (
                    <a
                      href={`https://twitter.com/${profile.social_links.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {profile?.social_links?.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${profile.social_links.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {profile?.skills?.length ? (
                profile.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills listed</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
