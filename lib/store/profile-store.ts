import { makeAutoObservable, runInAction } from "mobx"
import type { RootStore } from "./index"

export interface Skill {
  id: string
  name: string
  level?: "beginner" | "intermediate" | "advanced" | "expert"
}

export interface SocialLink {
  platform: string
  url: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current: boolean
}

export interface Experience {
  company: string
  position: string
  description?: string
  startDate: string
  endDate?: string
  current: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  url?: string
  imageUrl?: string
  technologies: string[]
  startDate: string
  endDate?: string
}

export interface UserProfile {
  userId: string
  bio?: string
  headline?: string
  location?: string
  website?: string
  skills: Skill[]
  socialLinks: SocialLink[]
  education: Education[]
  experience: Experience[]
  projects: Project[]
  interests: string[]
  availability: "available" | "limited" | "unavailable"
  lookingFor?: string[]
}

export class ProfileStore {
  profiles: Record<string, UserProfile> = {}
  currentProfile: UserProfile | null = null
  isLoading = false
  error: string | null = null
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      rootStore: false,
    })
  }

  // Actions
  setProfiles = (profiles: Record<string, UserProfile>) => {
    this.profiles = profiles
  }

  setProfile = (userId: string, profile: UserProfile) => {
    this.profiles[userId] = profile

    // Update current profile if it's for the current user
    if (this.rootStore.userStore.currentUser?.id === userId) {
      this.currentProfile = profile
    }
  }

  setCurrentProfile = (profile: UserProfile | null) => {
    this.currentProfile = profile
  }

  updateProfile = (userId: string, profileData: Partial<UserProfile>) => {
    if (this.profiles[userId]) {
      this.profiles[userId] = { ...this.profiles[userId], ...profileData }

      // Update current profile if it's for the current user
      if (this.rootStore.userStore.currentUser?.id === userId) {
        this.currentProfile = this.profiles[userId]
      }
    }
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchProfile = async (userId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // Check if we already have this profile cached
      if (this.profiles[userId]) {
        return this.profiles[userId]
      }

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockProfile: UserProfile = {
        userId,
        bio: "Software developer with a passion for building community tools and platforms.",
        headline: "Full Stack Developer | Hackathon Enthusiast",
        location: "San Francisco, CA",
        website: "https://example.com",
        skills: [
          { id: "1", name: "JavaScript", level: "expert" },
          { id: "2", name: "React", level: "advanced" },
          { id: "3", name: "Node.js", level: "intermediate" },
          { id: "4", name: "TypeScript", level: "advanced" },
        ],
        socialLinks: [
          { platform: "github", url: "https://github.com/username" },
          { platform: "twitter", url: "https://twitter.com/username" },
          { platform: "linkedin", url: "https://linkedin.com/in/username" },
        ],
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor's",
            field: "Computer Science",
            startDate: "2016-09-01",
            endDate: "2020-05-31",
            current: false,
          },
        ],
        experience: [
          {
            company: "Tech Startup",
            position: "Senior Developer",
            description: "Leading development of community platform features",
            startDate: "2020-06-01",
            current: true,
          },
          {
            company: "Web Agency",
            position: "Junior Developer",
            description: "Worked on client websites and applications",
            startDate: "2018-01-01",
            endDate: "2020-05-31",
            current: false,
          },
        ],
        projects: [
          {
            id: "1",
            title: "Community Platform",
            description: "Open-source platform for building communities",
            url: "https://github.com/username/community-platform",
            technologies: ["React", "Node.js", "PostgreSQL"],
            startDate: "2021-01-01",
          },
        ],
        interests: ["Open Source", "Hackathons", "Web Development", "AI"],
        availability: "limited",
        lookingFor: ["Collaboration", "Mentorship", "Hackathon Team"],
      }

      runInAction(() => {
        this.setProfile(userId, mockProfile)
      })

      return mockProfile
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch profile")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get existing profile or create a new one
      const existingProfile = this.profiles[userId] || {
        userId,
        bio: "",
        skills: [],
        socialLinks: [],
        education: [],
        experience: [],
        projects: [],
        interests: [],
        availability: "available",
      }

      // Merge the existing profile with the new data
      const updatedProfile = { ...existingProfile, ...profileData }

      runInAction(() => {
        this.setProfile(userId, updatedProfile)
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to update profile")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  addSkill = async (userId: string, skill: Skill) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const profile = this.profiles[userId]
      if (!profile) throw new Error("Profile not found")

      const updatedSkills = [...profile.skills, skill]

      runInAction(() => {
        this.updateProfile(userId, { skills: updatedSkills })
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to add skill")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  removeSkill = async (userId: string, skillId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const profile = this.profiles[userId]
      if (!profile) throw new Error("Profile not found")

      const updatedSkills = profile.skills.filter((s) => s.id !== skillId)

      runInAction(() => {
        this.updateProfile(userId, { skills: updatedSkills })
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to remove skill")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
