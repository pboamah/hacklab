import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface Group {
  id: string
  name: string
  description: string
  community_id?: string
  created_at: string
  updated_at: string
  member_count: number
  is_private: boolean
  allowed_roles?: string[]
  moderators?: string[]
  is_subscribed?: boolean
  image_url?: string
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: "member" | "moderator" | "admin"
  joined_at: string
  user?: any
}

export class GroupStore {
  groups: Group[] = []
  communityGroups: Record<string, Group[]> = {}
  currentGroup: Group | null = null
  members: Record<string, GroupMember[]> = {} // groupId -> members
  joinedGroups: Group[] = []
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
  setGroups = (groups: Group[]) => {
    this.groups = groups
  }

  setCommunityGroups = (communityId: string, groups: Group[]) => {
    this.communityGroups = {
      ...this.communityGroups,
      [communityId]: groups,
    }
  }

  setCurrentGroup = (group: Group | null) => {
    this.currentGroup = group
  }

  setMembers = (groupId: string, members: GroupMember[]) => {
    this.members = {
      ...this.members,
      [groupId]: members,
    }
  }

  setJoinedGroups = (groups: Group[]) => {
    this.joinedGroups = groups
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Computed values
  getGroupMembers = (groupId: string): GroupMember[] => {
    return this.members[groupId] || []
  }

  isGroupMember = (groupId: string, userId: string): boolean => {
    return this.getGroupMembers(groupId).some((member) => member.user_id === userId)
  }

  // Async actions
  fetchGroups = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase.from("groups").select("*").order("created_at", { ascending: false })

      if (error) throw error

      runInAction(() => {
        this.setGroups(data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch groups")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchCommunityGroups = async (communityId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false })

      if (error) throw error

      runInAction(() => {
        this.setCommunityGroups(communityId, data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch community groups")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchGroupById = async (groupId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase.from("groups").select("*").eq("id", groupId).single()

      if (error) throw error

      runInAction(() => {
        this.setCurrentGroup(data)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch group")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchGroupMembers = async (groupId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("group_members")
        .select(`
          *,
          user:users!user_id(*)
        `)
        .eq("group_id", groupId)
        .order("joined_at", { ascending: false })

      if (error) throw error

      runInAction(() => {
        this.setMembers(groupId, data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch group members")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchJoinedGroups = async (userId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("group_members")
        .select(`
          group:groups!group_id(*)
        `)
        .eq("user_id", userId)
        .order("joined_at", { ascending: false })

      if (error) throw error

      const groups = data?.map((item) => item.group) || []

      runInAction(() => {
        this.setJoinedGroups(groups)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch joined groups")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  joinGroup = async (groupId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: this.rootStore.userStore.currentUser.id,
        role: "member",
      })

      if (error) throw error

      // Update member count
      if (this.currentGroup?.id === groupId) {
        runInAction(() => {
          this.currentGroup = {
            ...this.currentGroup!,
            member_count: this.currentGroup!.member_count + 1,
          }
        })
      }

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to join group")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  leaveGroup = async (groupId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", this.rootStore.userStore.currentUser.id)

      if (error) throw error

      // Update member count
      if (this.currentGroup?.id === groupId) {
        runInAction(() => {
          this.currentGroup = {
            ...this.currentGroup!,
            member_count: Math.max(0, this.currentGroup!.member_count - 1),
          }
        })
      }

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to leave group")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createGroup = async (groupData: { name: string; description: string; communityId?: string; isPrivate: boolean }) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      // Create the group
      const { data, error } = await supabase
        .from("groups")
        .insert({
          name: groupData.name,
          description: groupData.description,
          community_id: groupData.communityId,
          is_private: groupData.isPrivate,
          member_count: 1, // Creator is the first member
        })
        .select()
        .single()

      if (error) throw error

      // Add creator as admin
      const { error: memberError } = await supabase.from("group_members").insert({
        group_id: data.id,
        user_id: this.rootStore.userStore.currentUser.id,
        role: "admin",
      })

      if (memberError) throw memberError

      runInAction(() => {
        // Update groups list
        this.groups = [data, ...this.groups]

        // Update community groups if applicable
        if (groupData.communityId && this.communityGroups[groupData.communityId]) {
          this.communityGroups = {
            ...this.communityGroups,
            [groupData.communityId]: [data, ...this.communityGroups[groupData.communityId]],
          }
        }
      })

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create group")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
