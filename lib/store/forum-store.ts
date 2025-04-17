import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"

export interface Forum {
  id: string
  name: string
  description: string
  community_id: string
  created_at: string
  updated_at: string
  topic_count?: number
  post_count?: number
  last_activity?: string
  is_archived?: boolean
  is_private?: boolean
  allowed_roles?: string[]
  moderators?: string[]
  is_subscribed?: boolean
}

export interface ForumTopic {
  id: string
  title: string
  content: string
  forum_id: string
  author_id: string
  created_at: string
  updated_at: string
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  reply_count?: number
  last_reply_at?: string
  tags?: string[]
  author?: any
  is_subscribed?: boolean
}

export interface ForumPost {
  id: string
  content: string
  topic_id: string
  author_id: string
  created_at: string
  updated_at: string
  is_solution: boolean
  parent_id?: string
  author?: any
  reactions?: any[]
  is_flagged?: boolean
  flag_reason?: string
  edit_history?: {
    content: string
    edited_at: string
    edited_by: string
  }[]
}

export interface ForumReport {
  id: string
  reporter_id: string
  content_type: "topic" | "post"
  content_id: string
  reason: string
  description?: string
  status: "pending" | "reviewing" | "resolved" | "dismissed"
  created_at: string
  resolved_at?: string
  resolved_by?: string
  reporter?: any
  content?: any
}

export class ForumStore {
  forums: Forum[] = []
  communityForums: Record<string, Forum[]> = {}
  currentForum: Forum | null = null
  topics: Record<string, ForumTopic[]> = {} // forumId -> topics
  currentTopic: ForumTopic | null = null
  posts: Record<string, ForumPost[]> = {} // topicId -> posts
  subscribedForums: Forum[] = []
  subscribedTopics: ForumTopic[] = []
  reports: ForumReport[] = []
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
  setForums = (forums: Forum[]) => {
    this.forums = forums
  }

  setCommunityForums = (communityId: string, forums: Forum[]) => {
    this.communityForums = {
      ...this.communityForums,
      [communityId]: forums,
    }
  }

  setCurrentForum = (forum: Forum | null) => {
    this.currentForum = forum
  }

  setTopics = (forumId: string, topics: ForumTopic[]) => {
    this.topics = {
      ...this.topics,
      [forumId]: topics,
    }
  }

  setCurrentTopic = (topic: ForumTopic | null) => {
    this.currentTopic = topic
  }

  setPosts = (topicId: string, posts: ForumPost[]) => {
    this.posts = {
      ...this.posts,
      [topicId]: posts,
    }
  }

  setSubscribedForums = (forums: Forum[]) => {
    this.subscribedForums = forums
  }

  setSubscribedTopics = (topics: ForumTopic[]) => {
    this.subscribedTopics = topics
  }

  setReports = (reports: ForumReport[]) => {
    this.reports = reports
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Computed values
  getForumTopics = (forumId: string): ForumTopic[] => {
    return this.topics[forumId] || []
  }

  getTopicPosts = (topicId: string): ForumPost[] => {
    return this.posts[topicId] || []
  }

  getCommentCount = (postId: string) => {
    return this.posts[postId]?.length || 0
  }

  // Async actions
  fetchForums = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase.from("forums").select("*").order("created_at", { ascending: false })

      if (error) throw error

      runInAction(() => {
        this.setForums(data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch forums")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchCommunityForums = async (communityId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("forums")
        .select("*")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false })

      if (error) throw error

      runInAction(() => {
        this.setCommunityForums(communityId, data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch community forums")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchForumById = async (forumId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase.from("forums").select("*").eq("id", forumId).single()

      if (error) throw error

      runInAction(() => {
        this.setCurrentForum(data)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch forum")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchForumTopics = async (forumId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`
        *,
        author:users!author_id(*)
      `)
        .eq("forum_id", forumId)
        .order("created_at", { ascending: false })

      if (error) throw error

      runInAction(() => {
        this.setTopics(forumId, data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch forum topics")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchTopicById = async (topicId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`
        *,
        author:users!author_id(*)
      `)
        .eq("id", topicId)
        .single()

      if (error) throw error

      runInAction(() => {
        this.setCurrentTopic(data)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch topic")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchTopicPosts = async (topicId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`
        *,
        author:users!author_id(*)
      `)
        .eq("topic_id", topicId)
        .order("created_at", { ascending: true })

      if (error) throw error

      runInAction(() => {
        this.setPosts(topicId, data || [])
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch topic posts")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createTopic = async (topicData: { title: string; content: string; forumId: string; isPinned: boolean }) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("forum_topics")
        .insert({
          title: topicData.title,
          content: topicData.content,
          forum_id: topicData.forumId,
          author_id: this.rootStore.userStore.currentUser.id,
          is_pinned: topicData.isPinned,
        })
        .select()
        .single()

      if (error) throw error

      const newTopic = {
        ...data,
        author: this.rootStore.userStore.currentUser,
      }

      runInAction(() => {
        // Update topics list
        if (this.topics[topicData.forumId]) {
          this.topics = {
            ...this.topics,
            [topicData.forumId]: [newTopic, ...this.topics[topicData.forumId]],
          }
        } else {
          this.topics = {
            ...this.topics,
            [topicData.forumId]: [newTopic],
          }
        }

        // Update forum topic count
        if (this.currentForum?.id === topicData.forumId) {
          this.currentForum = {
            ...this.currentForum,
            topic_count: (this.currentForum.topic_count || 0) + 1,
          }
        }
      })

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create topic")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createPost = async (postData: { content: string; topicId: string; parentId?: string }) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .insert({
          content: postData.content,
          topic_id: postData.topicId,
          author_id: this.rootStore.userStore.currentUser.id,
          parent_id: postData.parentId,
        })
        .select()
        .single()

      if (error) throw error

      const newPost = {
        ...data,
        author: this.rootStore.userStore.currentUser,
      }

      runInAction(() => {
        // Update posts list
        if (this.posts[postData.topicId]) {
          this.posts = {
            ...this.posts,
            [postData.topicId]: [...this.posts[postData.topicId], newPost],
          }
        } else {
          this.posts = {
            ...this.posts,
            [postData.topicId]: [newPost],
          }
        }

        // Update reply counts
        if (this.currentTopic) {
          this.currentTopic = {
            ...this.currentTopic,
            reply_count: (this.currentTopic.reply_count || 0) + 1,
          }
        }
      })

      return data
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create post")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  markPostAsSolution = async (postId: string, topicId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      // First, unmark any existing solution
      const { error: clearError } = await supabase
        .from("forum_posts")
        .update({ is_solution: false })
        .eq("topic_id", topicId)
        .eq("is_solution", true)

      if (clearError) throw clearError

      // Then mark the new post as the solution
      const { error } = await supabase.from("forum_posts").update({ is_solution: true }).eq("id", postId)

      if (error) throw error

      runInAction(() => {
        // Update posts list
        this.posts = {
          ...this.posts,
          [topicId]: this.posts[topicId].map((post) => ({
            ...post,
            is_solution: post.id === postId,
          })),
        }

        // Update current topic if viewing
        if (this.currentTopic?.id === topicId) {
          this.currentTopic = {
            ...this.currentTopic,
            solution_id: postId,
          }
        }
      })

      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to mark post as solution")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
