import type React from "react"
import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"
import { Award, Medal, Trophy } from "lucide-react"

export interface Badge {
  id: string
  name: string
  description: string
  image_url: string
  requirement: string
  points_value: number
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface Achievement {
  id: string
  name: string
  description: string
  points: number
  icon: React.ReactNode
}

export interface GamificationProfile {
  user_id: string
  total_points: number
  level: number
  next_level_points: number
  badges: UserBadge[]
  recent_achievements: Achievement[]
}

export class GamificationStore {
  profile: GamificationProfile | null = null
  availableBadges: Badge[] = []
  userBadges: UserBadge[] = []
  recentAchievements: Achievement[] = []
  leaderboard: Array<{
    user_id: string
    user_name: string
    user_avatar?: string
    total_points: number
    level: number
  }> = []
  isLoading = false
  error: string | null = null
  rootStore: RootStore
  points = 250
  level = 2
  achievements: Achievement[] = []

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      rootStore: false,
    })

    // Initialize with some achievements
    this.achievements = [
      {
        id: "1",
        name: "First Post",
        description: "Created your first post",
        points: 50,
        icon: <Award className="h-5 w-5" />,
      },
      {
        id: "2",
        name: "Community Joiner",
        description: "Joined 2 communities",
        points: 100,
        icon: <Medal className="h-5 w-5" />,
      },
      {
        id: "3",
        name: "Hackathon Participant",
        description: "Participated in a hackathon",
        points: 100,
        icon: <Trophy className="h-5 w-5" />,
      },
    ]
  }

  // Actions
  setProfile = (profile: GamificationProfile | null) => {
    this.profile = profile
  }

  setAvailableBadges = (badges: Badge[]) => {
    this.availableBadges = badges
  }

  setUserBadges = (badges: UserBadge[]) => {
    this.userBadges = badges
  }

  setRecentAchievements = (achievements: Achievement[]) => {
    this.recentAchievements = achievements
  }

  setLeaderboard = (
    leaderboard: Array<{
      user_id: string
      user_name: string
      user_avatar?: string
      total_points: number
      level: number
    }>,
  ) => {
    this.leaderboard = leaderboard
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Helpers
  getLevelFromPoints = (points: number): number => {
    // Simple level calculation: 1 level per 100 points
    return Math.floor(points / 100) + 1
  }

  getNextLevelPoints = (currentPoints: number): number => {
    const currentLevel = this.getLevelFromPoints(currentPoints)
    return currentLevel * 100
  }

  getProgressToNextLevel = (): number => {
    if (!this.profile) return 0

    const currentLevelMinPoints = (this.profile.level - 1) * 100
    const pointsInCurrentLevel = this.profile.total_points - currentLevelMinPoints
    const pointsNeededForNextLevel = 100 // Each level requires 100 points

    return (pointsInCurrentLevel / pointsNeededForNextLevel) * 100
  }

  addPoints(amount: number) {
    this.points += amount
    this.updateLevel()
  }

  private updateLevel() {
    // Simple level calculation
    this.level = Math.floor(this.points / 100) + 1
  }

  // Async actions
  fetchUserGamificationProfile = async () => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const userId = this.rootStore.userStore.currentUser.id

    try {
      // Get user points and level
      const { data: pointsData, error: pointsError } = await supabase
        .from("user_points")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (pointsError && pointsError.code !== "PGRST116") throw pointsError

      let totalPoints = 0
      if (pointsData) {
        totalPoints = pointsData.total_points
      } else {
        // Create points record if it doesn't exist
        const { error: createError } = await supabase.from("user_points").insert({ user_id: userId, total_points: 0 })

        if (createError) throw createError
      }

      // Get user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from("user_badges")
        .select(`
          *,
          badge:badges(*)
        `)
        .eq("user_id", userId)

      if (badgesError) throw badgesError

      // Get recent achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)

      if (achievementsError) throw achievementsError

      const level = this.getLevelFromPoints(totalPoints)
      const nextLevelPoints = this.getNextLevelPoints(totalPoints)

      const profile: GamificationProfile = {
        user_id: userId,
        total_points: totalPoints,
        level,
        next_level_points: nextLevelPoints,
        badges: badgesData || [],
        recent_achievements: achievementsData || [],
      }

      runInAction(() => {
        this.setProfile(profile)
        this.setUserBadges(badgesData || [])
        this.setRecentAchievements(achievementsData || [])
      })

      return profile
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch gamification profile")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchAvailableBadges = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase.from("badges").select("*").order("points_value", { ascending: true })

      if (error) throw error

      runInAction(() => {
        this.setAvailableBadges(data || [])
      })

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch available badges")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchLeaderboard = async (limit = 10) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("user_points")
        .select(`
          user_id,
          total_points,
          users:user_id(full_name, avatar_url)
        `)
        .order("total_points", { ascending: false })
        .limit(limit)

      if (error) throw error

      const leaderboard = data.map((item) => ({
        user_id: item.user_id,
        user_name: item.users?.full_name || "Unknown User",
        user_avatar: item.users?.avatar_url,
        total_points: item.total_points,
        level: this.getLevelFromPoints(item.total_points),
      }))

      runInAction(() => {
        this.setLeaderboard(leaderboard)
      })

      return leaderboard
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch leaderboard")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  awardPoints = async (points: number, description: string, type = "activity") => {
    if (!this.rootStore.userStore.currentUser) return false
    if (points <= 0) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const userId = this.rootStore.userStore.currentUser.id

    try {
      // Add points to user's total
      const { error: pointsError } = await supabase.rpc("add_user_points", {
        user_id_param: userId,
        points_to_add: points,
      })

      if (pointsError) throw pointsError

      // Record the achievement
      const { error: achievementError } = await supabase.from("user_achievements").insert({
        user_id: userId,
        type,
        points,
        description,
      })

      if (achievementError) throw achievementError

      // Update the local profile
      if (this.profile) {
        const updatedPoints = this.profile.total_points + points
        const level = this.getLevelFromPoints(updatedPoints)
        const nextLevelPoints = this.getNextLevelPoints(updatedPoints)

        runInAction(() => {
          this.profile = {
            ...this.profile!,
            total_points: updatedPoints,
            level,
            next_level_points: nextLevelPoints,
          }
        })
      }

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to award points")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  checkForBadges = async () => {
    if (!this.rootStore.userStore.currentUser || !this.profile) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()
    const userId = this.rootStore.userStore.currentUser.id

    try {
      // Get all available badges
      const { data: availableBadges, error: badgesError } = await supabase.from("badges").select("*")

      if (badgesError) throw badgesError

      // Get user's current badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", userId)

      if (userBadgesError) throw userBadgesError

      const userBadgeIds = new Set(userBadges.map((badge) => badge.badge_id))

      // Check for badges to award based on points
      const badgesToAward = availableBadges.filter(
        (badge) => !userBadgeIds.has(badge.id) && this.profile!.total_points >= badge.points_value,
      )

      // Award new badges
      for (const badge of badgesToAward) {
        const { error } = await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: badge.id,
        })

        if (error) throw error

        // Record achievement for the badge
        await this.awardPoints(10, `Earned the ${badge.name} badge`, "badge")
      }

      // Refresh user badges if any were awarded
      if (badgesToAward.length > 0) {
        await this.fetchUserGamificationProfile()
      }

      return badgesToAward.length > 0
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to check for badges")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
