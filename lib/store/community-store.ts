import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"
import { awardPoints, PointsCategory } from "@/lib/gamification"

export interface Community {
  id: string
  name: string
  description: string
  image_url?: string
  cover_image?: string
  privacy: "public" | "private"
  category?: string
  tags?: string[]
  created_at: string
  updated_at: string
  created_by: string
  memberCount?: number
  members?: any[]
  isMember?: boolean
  isAdmin?: boolean
}

export class CommunityStore {
  communities: Community[] = []
  myCommunities: Community[] = []
  currentCommunity: Community | null = null
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
  setCommunities = (communities: Community[]) => {
    this.communities = communities
  }

  setMyCommunities = (communities: Community[]) => {
    this.myCommunities = communities
  }

  setCurrentCommunity = (community: Community | null) => {
    this.currentCommunity = community
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchCommunities = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("communities")
        .select(`
          *,
          members:community_members(user_id, role),
          created_by:users!created_by(id, full_name, avatar_url)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Process communities
      const processedCommunities = data.map((community) => {
        const isMember = community.members
          ? community.members.some((member: any) => member.user_id === this.rootStore.userStore.currentUser?.id)
          : false

        const isAdmin = community.members
          ? community.members.some(
              (member: any) =>
                member.user_id === this.rootStore.userStore.currentUser?.id &&
                (member.role === "admin" || member.role === "owner"),
            )
          : false

        return {
          ...community,
          memberCount: community.members?.length || 0,
          isMember,
          isAdmin,
        }
      })

      // Filter my communities
      const myCommunitiesData = processedCommunities.filter((community) => community.isMember)

      runInAction(() => {
        this.setCommunities(processedCommunities)
        this.setMyCommunities(myCommunitiesData)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch communities")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchCommunityById = async (id: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("communities")
        .select(`
          *,
          members:community_members(*, user:users(*)),
          discussions:posts(*, author:users!author_id(*)),
          events(*)
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      // Process community
      const isMember = data.members
        ? data.members.some((member: any) => member.user_id === this.rootStore.userStore.currentUser?.id)
        : false

      const isAdmin = data.members
        ? data.members.some(
            (member: any) =>
              member.user_id === this.rootStore.userStore.currentUser?.id &&
              (member.role === "admin" || member.role === "owner"),
          )
        : false

      const processedCommunity = {
        ...data,
        memberCount: data.members?.length || 0,
        isMember,
        isAdmin,
      }

      runInAction(() => {
        this.setCurrentCommunity(processedCommunity)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch community")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createCommunity = async (communityData: Partial<Community>) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      // Create community
      const { data, error } = await supabase
        .from("communities")
        .insert({
          ...communityData,
          created_by: this.rootStore.userStore.currentUser.id,
        })
        .select()
        .single()

      if (error) throw error

      // Add creator as admin member
      const { error: memberError } = await supabase.from("community_members").insert({
        community_id: data.id,
        user_id: this.rootStore.userStore.currentUser.id,
        role: "owner",
      })

      if (memberError) throw memberError

      const newCommunity = {
        ...data,
        memberCount: 1,
        isMember: true,
        isAdmin: true,
      }

      const userId = this.rootStore.userStore.currentUser.id
      const name = communityData.name || "Unnamed Community"
      await awardPoints(userId, PointsCategory.COMMUNITY_CREATION, `Created a new community: ${name}`)

      runInAction(() => {
        this.communities = [newCommunity, ...this.communities]
        this.myCommunities = [newCommunity, ...this.myCommunities]
      })

      return newCommunity
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create community")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  joinCommunity = async (communityId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase.from("community_members").insert({
        community_id: communityId,
        user_id: this.rootStore.userStore.currentUser.id,
        role: "member",
      })

      if (error) throw error

      const userId = this.rootStore.userStore.currentUser.id
      const communityName = this.communities.find((c) => c.id === communityId)?.name || "Unknown Community"
      await awardPoints(userId, PointsCategory.COMMUNITY_JOINING, `Joined community: ${communityName}`)

      runInAction(() => {
        // Update communities list
        this.communities = this.communities.map((community) => {
          if (community.id === communityId) {
            return {
              ...community,
              memberCount: (community.memberCount || 0) + 1,
              isMember: true,
            }
          }
          return community
        })

        // Add to my communities
        const communityToAdd = this.communities.find((c) => c.id === communityId)
        if (communityToAdd && !this.myCommunities.some((c) => c.id === communityId)) {
          this.myCommunities = [
            ...this.myCommunities,
            {
              ...communityToAdd,
              isMember: true,
            },
          ]
        }

        // Update current community if viewing
        if (this.currentCommunity?.id === communityId) {
          this.currentCommunity = {
            ...this.currentCommunity,
            memberCount: (this.currentCommunity.memberCount || 0) + 1,
            isMember: true,
          }
        }
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to join community")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  leaveCommunity = async (communityId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("community_id", communityId)
        .eq("user_id", this.rootStore.userStore.currentUser.id)

      if (error) throw error

      runInAction(() => {
        // Update communities list
        this.communities = this.communities.map((community) => {
          if (community.id === communityId) {
            return {
              ...community,
              memberCount: Math.max((community.memberCount || 0) - 1, 0),
              isMember: false,
              isAdmin: false,
            }
          }
          return community
        })

        // Remove from my communities
        this.myCommunities = this.myCommunities.filter((c) => c.id !== communityId)

        // Update current community if viewing
        if (this.currentCommunity?.id === communityId) {
          this.currentCommunity = {
            ...this.currentCommunity,
            memberCount: Math.max((this.currentCommunity.memberCount || 0) - 1, 0),
            isMember: false,
            isAdmin: false,
          }
        }
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to leave community")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
