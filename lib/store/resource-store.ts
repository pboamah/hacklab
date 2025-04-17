import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface Resource {
  id: string
  title: string
  description: string
  type: "article" | "video" | "document" | "link" | "other"
  category: string
  url?: string
  file_path?: string
  author_id: string
  community_id?: string
  created_at: string
  updated_at: string
  view_count: number
  download_count: number
  is_featured: boolean
  tags?: string[]
  author?: any
}

export class ResourceStore {
  resources: Resource[] = []
  communityResources: Record<string, Resource[]> = {}
  currentResource: Resource | null = null
  featuredResources: Resource[] = []
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
  setResources = (resources: Resource[]) => {
    this.resources = resources
  }

  setCommunityResources = (communityId: string, resources: Resource[]) => {
    this.communityResources = {
      ...this.communityResources,
      [communityId]: resources,
    }
  }

  setCurrentResource = (resource: Resource | null) => {
    this.currentResource = resource
  }

  setFeaturedResources = (resources: Resource[]) => {
    this.featuredResources = resources
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchResources = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("resources")
        .select(`
          *,
          author:users!author_id(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      runInAction(() => {
        this.setResources(data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch resources")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchCommunityResources = async (communityId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("resources")
        .select(`
          *,
          author:users!author_id(*)
        `)
        .eq("community_id", communityId)
        .order("created_at", { ascending: false })

      if (error) throw error

      runInAction(() => {
        this.setCommunityResources(communityId, data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch community resources")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchResourceById = async (resourceId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("resources")
        .select(`
          *,
          author:users!author_id(*)
        `)
        .eq("id", resourceId)
        .single()

      if (error) throw error

      // Increment view count
      await supabase.rpc("increment_resource_views", { resource_id: resourceId })

      runInAction(() => {
        this.setCurrentResource(data)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch resource")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchFeaturedResources = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("resources")
        .select(`
          *,
          author:users!author_id(*)
        `)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error

      runInAction(() => {
        this.setFeaturedResources(data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch featured resources")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createResource = async (resourceData: {
    title: string
    description: string
    type: "article" | "video" | "document" | "link" | "other"
    category: string
    url?: string
    file?: File
    communityId?: string
    tags?: string[]
  }) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      let filePath: string | null = null

      // Upload file if provided
      if (resourceData.file) {
        const fileExt = resourceData.file.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const storagePath = `resources/${fileName}`

        const { error: uploadError } = await supabase.storage.from("resources").upload(storagePath, resourceData.file)

        if (uploadError) throw uploadError

        filePath = supabase.storage.from("resources").getPublicUrl(storagePath).data.publicUrl
      }

      // Create resource record
      const { data, error } = await supabase
        .from("resources")
        .insert({
          title: resourceData.title,
          description: resourceData.description,
          type: resourceData.type,
          category: resourceData.category,
          url: resourceData.url,
          file_path: filePath,
          author_id: this.rootStore.userStore.currentUser.id,
          community_id: resourceData.communityId,
          tags: resourceData.tags,
        })
        .select()
        .single()

      if (error) throw error

      const newResource = {
        ...data,
        author: this.rootStore.userStore.currentUser,
      }

      runInAction(() => {
        // Update resources list
        this.resources = [newResource, ...this.resources]

        // Update community resources if applicable
        if (resourceData.communityId && this.communityResources[resourceData.communityId]) {
          this.communityResources = {
            ...this.communityResources,
            [resourceData.communityId]: [newResource, ...this.communityResources[resourceData.communityId]],
          }
        }
      })

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create resource")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  incrementDownloadCount = async (resourceId: string) => {
    const supabase = getBrowserClient()

    try {
      await supabase.rpc("increment_resource_downloads", { resource_id: resourceId })

      // Update local state
      if (this.currentResource?.id === resourceId) {
        runInAction(() => {
          this.currentResource = {
            ...this.currentResource!,
            download_count: this.currentResource!.download_count + 1,
          }
        })
      }
    } catch (error) {
      console.error("Failed to increment download count:", error)
    }
  }
}
