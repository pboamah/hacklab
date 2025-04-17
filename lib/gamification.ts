import { getBrowserClient } from "@/lib/supabase"

export enum PointsCategory {
  POST_CREATION = "post_creation",
  COMMENT = "comment",
  EVENT_ATTENDANCE = "event_attendance",
  EVENT_CREATION = "event_creation",
  RESOURCE_SHARING = "resource_sharing",
  PROFILE_COMPLETION = "profile_completion",
  COMMUNITY_CREATION = "community_creation",
  COMMUNITY_JOINING = "community_joining",
  DAILY_LOGIN = "daily_login",
  REACTION = "reaction",
}

interface PointsConfig {
  [PointsCategory.POST_CREATION]: number
  [PointsCategory.COMMENT]: number
  [PointsCategory.EVENT_ATTENDANCE]: number
  [PointsCategory.EVENT_CREATION]: number
  [PointsCategory.RESOURCE_SHARING]: number
  [PointsCategory.PROFILE_COMPLETION]: number
  [PointsCategory.COMMUNITY_CREATION]: number
  [PointsCategory.COMMUNITY_JOINING]: number
  [PointsCategory.DAILY_LOGIN]: number
  [PointsCategory.REACTION]: number
}

// Points configuration
const POINTS_CONFIG: PointsConfig = {
  [PointsCategory.POST_CREATION]: 10,
  [PointsCategory.COMMENT]: 5,
  [PointsCategory.EVENT_ATTENDANCE]: 15,
  [PointsCategory.EVENT_CREATION]: 25,
  [PointsCategory.RESOURCE_SHARING]: 20,
  [PointsCategory.PROFILE_COMPLETION]: 30,
  [PointsCategory.COMMUNITY_CREATION]: 50,
  [PointsCategory.COMMUNITY_JOINING]: 10,
  [PointsCategory.DAILY_LOGIN]: 5,
  [PointsCategory.REACTION]: 2,
}

// Descriptions for each points category
const POINTS_DESCRIPTIONS: Record<PointsCategory, string> = {
  [PointsCategory.POST_CREATION]: "Created a new post",
  [PointsCategory.COMMENT]: "Left a comment",
  [PointsCategory.EVENT_ATTENDANCE]: "Attended an event",
  [PointsCategory.EVENT_CREATION]: "Created a new event",
  [PointsCategory.RESOURCE_SHARING]: "Shared a resource",
  [PointsCategory.PROFILE_COMPLETION]: "Completed your profile",
  [PointsCategory.COMMUNITY_CREATION]: "Created a new community",
  [PointsCategory.COMMUNITY_JOINING]: "Joined a community",
  [PointsCategory.DAILY_LOGIN]: "Logged in today",
  [PointsCategory.REACTION]: "Reacted to content",
}

/**
 * Award points to a user for a specific action
 * @param userId The user ID to award points to
 * @param category The category of action
 * @param customDescription Optional custom description
 * @returns Promise<boolean> Success status
 */
export async function awardPoints(
  userId: string,
  category: PointsCategory,
  customDescription?: string,
): Promise<boolean> {
  if (!userId) return false

  try {
    const supabase = getBrowserClient()
    const points = POINTS_CONFIG[category]
    const description = customDescription || POINTS_DESCRIPTIONS[category]

    const response = await fetch("/api/gamification/award-points", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        points,
        description,
        type: category,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to award points")
    }

    return true
  } catch (error) {
    console.error("Error awarding points:", error)
    return false
  }
}

/**
 * Check if a user has earned a badge
 * @param userId The user ID to check badges for
 * @returns Promise<boolean> Whether any new badges were earned
 */
export async function checkForBadges(userId: string): Promise<boolean> {
  if (!userId) return false

  try {
    const supabase = getBrowserClient()

    // Get user's current points
    const { data: pointsData, error: pointsError } = await supabase
      .from("user_points")
      .select("total_points")
      .eq("user_id", userId)
      .single()

    if (pointsError) throw pointsError

    const totalPoints = pointsData?.total_points || 0

    // Get user's current badges
    const { data: userBadges, error: userBadgesError } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId)

    if (userBadgesError) throw userBadgesError

    const userBadgeIds = new Set(userBadges.map((badge) => badge.badge_id))

    // Get badges that user might qualify for
    const { data: availableBadges, error: badgesError } = await supabase
      .from("badges")
      .select("*")
      .lte("points_value", totalPoints)

    if (badgesError) throw badgesError

    // Award badges user doesn't already have
    let badgesAwarded = false
    for (const badge of availableBadges) {
      if (!userBadgeIds.has(badge.id)) {
        const { error } = await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: badge.id,
        })

        if (!error) {
          badgesAwarded = true

          // Create notification for the new badge
          await supabase.from("notifications").insert({
            user_id: userId,
            type: "badge",
            content: `You earned the ${badge.name} badge!`,
            related_id: badge.id,
          })
        }
      }
    }

    return badgesAwarded
  } catch (error) {
    console.error("Error checking for badges:", error)
    return false
  }
}
