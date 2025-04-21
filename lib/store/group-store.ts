import { makeAutoObservable, runInAction } from "mobx"
import type { RootStore } from "./index"

export interface Group {
  id: string
  name: string
  description: string
  imageUrl?: string
  coverImage?: string
  privacy: "public" | "private" | "secret"
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  memberCount: number
  members?: any[]
  isMember?: boolean
  isAdmin?: boolean
}

export class GroupStore {
  groups: Group[] = []
  myGroups: Group[] = []
  currentGroup: Group | null = null
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

  setMyGroups = (groups: Group[]) => {
    this.myGroups = groups
  }

  setCurrentGroup = (group: Group | null) => {
    this.currentGroup = group
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchGroups = async () => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockGroups: Group[] = [
        {
          id: "1",
          name: "Frontend Developers",
          description: "A group for frontend developers to share knowledge and resources",
          privacy: "public",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "1",
          memberCount: 120,
          isMember: true,
          isAdmin: false,
        },
        {
          id: "2",
          name: "Backend Engineers",
          description: "Discussions about backend technologies and best practices",
          privacy: "public",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "2",
          memberCount: 85,
          isMember: false,
          isAdmin: false,
        },
        {
          id: "3",
          name: "DevOps Specialists",
          description: "For those interested in DevOps, CI/CD, and infrastructure",
          privacy: "public",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "3",
          memberCount: 65,
          isMember: true,
          isAdmin: true,
        },
      ]

      // Filter my groups
      const myGroupsData = mockGroups.filter((group) => group.isMember)

      runInAction(() => {
        this.setGroups(mockGroups)
        this.setMyGroups(myGroupsData)
      })

      return mockGroups
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch groups")
      })
      return []
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchGroupById = async (id: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find in existing groups or create mock
      let group = this.groups.find((g) => g.id === id)

      if (!group) {
        group = {
          id,
          name: `Group ${id}`,
          description: "This is a group description",
          privacy: "public",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "1",
          memberCount: 50,
          isMember: false,
          isAdmin: false,
        }
      }

      runInAction(() => {
        this.setCurrentGroup(group!)
      })

      return group
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch group")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createGroup = async (groupData: Partial<Group>) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const currentUser = this.rootStore.userStore.currentUser

      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: groupData.name || "New Group",
        description: groupData.description || "",
        imageUrl: groupData.imageUrl,
        coverImage: groupData.coverImage,
        privacy: groupData.privacy || "public",
        category: groupData.category,
        tags: groupData.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.id,
        memberCount: 1,
        isMember: true,
        isAdmin: true,
      }

      runInAction(() => {
        this.groups = [newGroup, ...this.groups]
        this.myGroups = [newGroup, ...this.myGroups]
        this.currentGroup = newGroup
      })

      return newGroup
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

  joinGroup = async (groupId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      runInAction(() => {
        // Update groups list
        this.groups = this.groups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              memberCount: group.memberCount + 1,
              isMember: true,
            }
          }
          return group
        })

        // Add to my groups
        const groupToAdd = this.groups.find((g) => g.id === groupId)
        if (groupToAdd && !this.myGroups.some((g) => g.id === groupId)) {
          this.myGroups = [...this.myGroups, { ...groupToAdd, isMember: true }]
        }

        // Update current group if viewing
        if (this.currentGroup?.id === groupId) {
          this.currentGroup = {
            ...this.currentGroup,
            memberCount: this.currentGroup.memberCount + 1,
            isMember: true,
          }
        }
      })

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

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      runInAction(() => {
        // Update groups list
        this.groups = this.groups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              memberCount: Math.max(group.memberCount - 1, 0),
              isMember: false,
              isAdmin: false,
            }
          }
          return group
        })

        // Remove from my groups
        this.myGroups = this.myGroups.filter((g) => g.id !== groupId)

        // Update current group if viewing
        if (this.currentGroup?.id === groupId) {
          this.currentGroup = {
            ...this.currentGroup,
            memberCount: Math.max(this.currentGroup.memberCount - 1, 0),
            isMember: false,
            isAdmin: false,
          }
        }
      })

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
}
