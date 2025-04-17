import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase"
import type { RootStore } from "./root-store"
import { awardPoints, PointsCategory } from "@/lib/gamification"

export interface Post {
  id: string
  title: string
  content: string
  author_id: string
  community_id?: string
  created_at: string
  updated_at: string
  author?: any
  comments?: any[]
  likes?: any[]
  liked?: boolean
}

export class PostStore {
  posts: Post[] = []
  communityPosts: Record<string, Post[]> = {}
  currentPost: Post | null = null
  isLoading = false
  error: string | null = null
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  // Actions
  setPosts = (posts: Post[]) => {
    this.posts = posts
  }

  setCommunityPosts = (communityId: string, posts: Post[]) => {
    this.communityPosts = {
      ...this.communityPosts,
      [communityId]: posts,
    }
  }

  setCurrentPost = (post: Post | null) => {
    this.currentPost = post
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchPosts = async () => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:users!author_id(*),
          comments:post_comments(count),
          likes:post_likes(user_id)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Process posts
      const processedPosts = data.map((post) => ({
        ...post,
        comments: post.comments || [],
        likes: post.likes || [],
        liked: post.likes
          ? post.likes.some((like: any) => like.user_id === this.rootStore.userStore.currentUser?.id)
          : false,
      }))

      runInAction(() => {
        this.setPosts(processedPosts)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch posts")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchCommunityPosts = async (communityId: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:users!author_id(*),
          comments:post_comments(count),
          likes:post_likes(user_id)
        `)
        .eq("community_id", communityId)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Process posts
      const processedPosts = data.map((post) => ({
        ...post,
        comments: post.comments || [],
        likes: post.likes || [],
        liked: post.likes
          ? post.likes.some((like: any) => like.user_id === this.rootStore.userStore.currentUser?.id)
          : false,
      }))

      runInAction(() => {
        this.setCommunityPosts(communityId, processedPosts)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch community posts")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchPostById = async (id: string) => {
    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:users!author_id(*),
          comments:post_comments(*, author:users!author_id(*)),
          likes:post_likes(user_id)
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      // Process the post
      const processedPost = {
        ...data,
        comments: data.comments || [],
        likes: data.likes || [],
        liked: data.likes
          ? data.likes.some((like: any) => like.user_id === this.rootStore.userStore.currentUser?.id)
          : false,
      }

      runInAction(() => {
        this.setCurrentPost(processedPost)
      })
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch post")
      })
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createPost = async (postData: { title: string; content: string; communityId?: string }) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title: postData.title,
          content: postData.content,
          author_id: this.rootStore.userStore.currentUser.id,
          community_id: postData.communityId,
        })
        .select()
        .single()

      if (error) throw error

      const newPost = {
        ...data,
        author: this.rootStore.userStore.currentUser,
        comments: [],
        likes: [],
        liked: false,
      }

      runInAction(() => {
        this.posts = [newPost, ...this.posts]

        // Add to community posts if applicable
        if (postData.communityId && this.communityPosts[postData.communityId]) {
          this.communityPosts = {
            ...this.communityPosts,
            [postData.communityId]: [newPost, ...this.communityPosts[postData.communityId]],
          }
        }
      })

      const userId = this.rootStore.userStore.currentUser.id
      const { title } = postData
      await awardPoints(userId, PointsCategory.POST_CREATION, `Created a new post: ${title}`)

      return newPost
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

  likePost = async (postId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: this.rootStore.userStore.currentUser.id,
      })

      if (error) throw error

      runInAction(() => {
        // Update posts list
        this.posts = this.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              liked: true,
              likes: [...(post.likes || []), { user_id: this.rootStore.userStore.currentUser?.id }],
            }
          }
          return post
        })

        // Update community posts if applicable
        Object.keys(this.communityPosts).forEach((communityId) => {
          this.communityPosts = {
            ...this.communityPosts,
            [communityId]: this.communityPosts[communityId].map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  liked: true,
                  likes: [...(post.likes || []), { user_id: this.rootStore.userStore.currentUser?.id }],
                }
              }
              return post
            }),
          }
        })

        // Update current post if viewing
        if (this.currentPost?.id === postId) {
          this.currentPost = {
            ...this.currentPost,
            liked: true,
            likes: [...(this.currentPost.likes || []), { user_id: this.rootStore.userStore.currentUser?.id }],
          }
        }
      })
      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to like post")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  unlikePost = async (postId: string) => {
    if (!this.rootStore.userStore.currentUser) return false

    this.setLoading(true)
    this.setError(null)
    const supabase = getBrowserClient()

    try {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", this.rootStore.userStore.currentUser.id)

      if (error) throw error

      runInAction(() => {
        // Update posts list
        this.posts = this.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              liked: false,
              likes: (post.likes || []).filter(
                (like: any) => like.user_id !== this.rootStore.userStore.currentUser?.id,
              ),
            }
          }
          return post
        })

        // Update community posts if applicable
        Object.keys(this.communityPosts).forEach((communityId) => {
          this.communityPosts = {
            ...this.communityPosts,
            [communityId]: this.communityPosts[communityId].map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  liked: false,
                  likes: (post.likes || []).filter(
                    (like: any) => like.user_id !== this.rootStore.userStore.currentUser?.id,
                  ),
                }
              }
              return post
            }),
          }
        })

        // Update current post if viewing
        if (this.currentPost?.id === postId) {
          this.currentPost = {
            ...this.currentPost,
            liked: false,
            likes: (this.currentPost.likes || []).filter(
              (like: any) => like.user_id !== this.rootStore.userStore.currentUser?.id,
            ),
          }
        }
      })
      return true
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to unlike post")
      })
      return false
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }
}
