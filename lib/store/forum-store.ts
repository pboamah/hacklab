import { makeAutoObservable, runInAction } from "mobx"
import type { RootStore } from "./index"

export interface ForumCategory {
  id: string
  name: string
  description: string
  slug: string
  parentId?: string
  order: number
  threadCount: number
  lastThreadId?: string
  lastThreadTitle?: string
  lastPostAt?: string
  lastPostUserId?: string
  lastPostUserName?: string
}

export interface ForumThread {
  id: string
  title: string
  slug: string
  categoryId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  pinned: boolean
  locked: boolean
  postCount: number
  viewCount: number
  lastPostAt?: string
  lastPostUserId?: string
  lastPostUserName?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface ForumPost {
  id: string
  threadId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  updatedAt: string
  isEdited: boolean
  isDeleted: boolean
  reactions?: { [key: string]: number }
}

export class ForumStore {
  categories: ForumCategory[] = []
  threads: Record<string, ForumThread[]> = {} // categoryId -> threads
  posts: Record<string, ForumPost[]> = {} // threadId -> posts
  currentThread: ForumThread | null = null
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
  setCategories = (categories: ForumCategory[]) => {
    this.categories = categories
  }

  setThreads = (categoryId: string, threads: ForumThread[]) => {
    this.threads[categoryId] = threads
  }

  setPosts = (threadId: string, posts: ForumPost[]) => {
    this.posts[threadId] = posts
  }

  setCurrentThread = (thread: ForumThread | null) => {
    this.currentThread = thread
  }

  addThread = (thread: ForumThread) => {
    const { categoryId } = thread

    if (!this.threads[categoryId]) {
      this.threads[categoryId] = []
    }

    this.threads[categoryId] = [thread, ...this.threads[categoryId]]

    // Update category thread count
    this.categories = this.categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          threadCount: category.threadCount + 1,
          lastThreadId: thread.id,
          lastThreadTitle: thread.title,
          lastPostAt: thread.createdAt,
          lastPostUserId: thread.authorId,
          lastPostUserName: thread.authorName,
        }
      }
      return category
    })
  }

  addPost = (post: ForumPost) => {
    const { threadId } = post

    if (!this.posts[threadId]) {
      this.posts[threadId] = []
    }

    this.posts[threadId].push(post)

    // Update thread post count and last post info
    if (this.currentThread && this.currentThread.id === threadId) {
      this.currentThread = {
        ...this.currentThread,
        postCount: this.currentThread.postCount + 1,
        lastPostAt: post.createdAt,
        lastPostUserId: post.authorId,
        lastPostUserName: post.authorName,
      }
    }

    // Update thread in category threads list
    Object.keys(this.threads).forEach((categoryId) => {
      this.threads[categoryId] = this.threads[categoryId].map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            postCount: thread.postCount + 1,
            lastPostAt: post.createdAt,
            lastPostUserId: post.authorId,
            lastPostUserName: post.authorName,
          }
        }
        return thread
      })
    })
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchCategories = async () => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockCategories: ForumCategory[] = [
        {
          id: "1",
          name: "General Discussion",
          description: "General topics related to the platform",
          slug: "general-discussion",
          order: 1,
          threadCount: 15,
        },
        {
          id: "2",
          name: "Hackathons",
          description: "Discuss upcoming and past hackathons",
          slug: "hackathons",
          order: 2,
          threadCount: 8,
          lastThreadId: "thread-1",
          lastThreadTitle: "Tips for first-time hackathon participants",
          lastPostAt: new Date().toISOString(),
          lastPostUserId: "1",
          lastPostUserName: "John Doe",
        },
        {
          id: "3",
          name: "Projects",
          description: "Share and discuss your projects",
          slug: "projects",
          order: 3,
          threadCount: 12,
        },
        {
          id: "4",
          name: "Job Board",
          description: "Job opportunities and career discussions",
          slug: "job-board",
          order: 4,
          threadCount: 5,
        },
      ]

      runInAction(() => {
        this.setCategories(mockCategories)
      })

      return mockCategories
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch categories")
      })
      return []
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchThreads = async (categoryId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockThreads: ForumThread[] = [
        {
          id: "thread-1",
          title: "Tips for first-time hackathon participants",
          slug: "tips-for-first-time-hackathon-participants",
          categoryId,
          authorId: "1",
          authorName: "John Doe",
          authorAvatar: "/avatars/01.png",
          content: "Here are some tips for those participating in their first hackathon...",
          pinned: true,
          locked: false,
          postCount: 12,
          viewCount: 156,
          lastPostAt: new Date().toISOString(),
          lastPostUserId: "2",
          lastPostUserName: "Jane Smith",
          createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
          updatedAt: new Date().toISOString(),
          tags: ["hackathon", "beginners", "tips"],
        },
        {
          id: "thread-2",
          title: "Looking for team members for upcoming hackathon",
          slug: "looking-for-team-members-for-upcoming-hackathon",
          categoryId,
          authorId: "3",
          authorName: "Bob Johnson",
          authorAvatar: "/avatars/03.png",
          content: "I'm looking for 2-3 team members for the upcoming hackathon...",
          pinned: false,
          locked: false,
          postCount: 8,
          viewCount: 89,
          lastPostAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          lastPostUserId: "4",
          lastPostUserName: "Alice Williams",
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          tags: ["hackathon", "team-building"],
        },
      ]

      runInAction(() => {
        this.setThreads(categoryId, mockThreads)
      })

      return mockThreads
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch threads")
      })
      return []
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchThread = async (threadId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find thread in existing threads
      let thread: ForumThread | undefined

      Object.values(this.threads).forEach((threadsArray) => {
        const found = threadsArray.find((t) => t.id === threadId)
        if (found) thread = found
      })

      if (!thread) {
        // Mock data if not found
        thread = {
          id: threadId,
          title: "Tips for first-time hackathon participants",
          slug: "tips-for-first-time-hackathon-participants",
          categoryId: "2",
          authorId: "1",
          authorName: "John Doe",
          authorAvatar: "/avatars/01.png",
          content: "Here are some tips for those participating in their first hackathon...",
          pinned: true,
          locked: false,
          postCount: 12,
          viewCount: 156,
          lastPostAt: new Date().toISOString(),
          lastPostUserId: "2",
          lastPostUserName: "Jane Smith",
          createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
          updatedAt: new Date().toISOString(),
          tags: ["hackathon", "beginners", "tips"],
        }
      }

      // Increment view count
      thread = {
        ...thread,
        viewCount: thread.viewCount + 1,
      }

      runInAction(() => {
        this.setCurrentThread(thread!)
      })

      return thread
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch thread")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  fetchPosts = async (threadId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockPosts: ForumPost[] = [
        {
          id: "post-1",
          threadId,
          authorId: "1",
          authorName: "John Doe",
          authorAvatar: "/avatars/01.png",
          content:
            "Here are some tips for those participating in their first hackathon:\n\n1. Don't try to learn a new technology during the hackathon\n2. Make sure to get enough sleep\n3. Plan your project scope carefully\n4. Network with other participants\n5. Have fun!",
          createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
          updatedAt: new Date(Date.now() - 604800000).toISOString(),
          isEdited: false,
          isDeleted: false,
          reactions: { "👍": 15, "❤️": 7 },
        },
        {
          id: "post-2",
          threadId,
          authorId: "2",
          authorName: "Jane Smith",
          authorAvatar: "/avatars/02.png",
          content: "Great tips! I'd also add that it's important to take breaks and stay hydrated during the event.",
          createdAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
          updatedAt: new Date(Date.now() - 518400000).toISOString(),
          isEdited: false,
          isDeleted: false,
          reactions: { "👍": 8 },
        },
        {
          id: "post-3",
          threadId,
          authorId: "3",
          authorName: "Bob Johnson",
          authorAvatar: "/avatars/03.png",
          content:
            "I found that having a clear role for each team member helps a lot. Make sure everyone knows what they're responsible for.",
          createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
          updatedAt: new Date(Date.now() - 432000000).toISOString(),
          isEdited: false,
          isDeleted: false,
          reactions: { "👍": 10, "💡": 5 },
        },
      ]

      runInAction(() => {
        this.setPosts(threadId, mockPosts)
      })

      return mockPosts
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch posts")
      })
      return []
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createThread = async (categoryId: string, title: string, content: string, tags?: string[]) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const currentUser = this.rootStore.userStore.currentUser
      const now = new Date().toISOString()

      const newThread: ForumThread = {
        id: `thread-${Date.now()}`,
        title,
        slug: title
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, "-"),
        categoryId,
        authorId: currentUser.id,
        authorName: currentUser.fullName,
        authorAvatar: currentUser.avatarUrl,
        content,
        pinned: false,
        locked: false,
        postCount: 1, // Initial post
        viewCount: 0,
        lastPostAt: now,
        lastPostUserId: currentUser.id,
        lastPostUserName: currentUser.fullName,
        createdAt: now,
        updatedAt: now,
        tags,
      }

      // Create initial post
      const initialPost: ForumPost = {
        id: `post-${Date.now()}`,
        threadId: newThread.id,
        authorId: currentUser.id,
        authorName: currentUser.fullName,
        authorAvatar: currentUser.avatarUrl,
        content,
        createdAt: now,
        updatedAt: now,
        isEdited: false,
        isDeleted: false,
        reactions: {},
      }

      runInAction(() => {
        this.addThread(newThread)
        this.setPosts(newThread.id, [initialPost])
        this.setCurrentThread(newThread)
      })

      return newThread
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to create thread")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  createPost = async (threadId: string, content: string) => {
    if (!this.rootStore.userStore.currentUser) return null

    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const currentUser = this.rootStore.userStore.currentUser
      const now = new Date().toISOString()

      const newPost: ForumPost = {
        id: `post-${Date.now()}`,
        threadId,
        authorId: currentUser.id,
        authorName: currentUser.fullName,
        authorAvatar: currentUser.avatarUrl,
        content,
        createdAt: now,
        updatedAt: now,
        isEdited: false,
        isDeleted: false,
        reactions: {},
      }

      runInAction(() => {
        this.addPost(newPost)
      })

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
}
