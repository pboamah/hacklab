// In-memory database to store application data
// This simulates a database for development purposes

// Type definitions
export interface Resource {
  id: string
  title: string
  description: string
  url?: string
  fileUrl?: string
  category: string
  tags: string[]
  createdBy: string
  communityId: string
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate?: string
  startTime: string
  endTime?: string
  isVirtual: boolean
  location?: string
  meetingLink?: string
  category: string
  capacity?: number
  communityId: string
  createdBy: string
  attendees: string[]
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  mediaUrls: string[]
  category: string
  tags: string[]
  communityId: string
  createdBy: string
  likes: string[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Community {
  id: string
  name: string
  description: string
  logoUrl?: string
  bannerUrl?: string
  category: string
  tags: string[]
  privacy: "public" | "restricted" | "private"
  rules?: string
  createdBy: string
  members: Member[]
  createdAt: string
  updatedAt: string
}

export interface Member {
  userId: string
  role: "admin" | "moderator" | "member"
  joinedAt: string
  status: "active" | "inactive" | "pending"
}

export interface User {
  id: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  bio?: string
  location?: string
  avatar?: string
  skills: string[]
  social: {
    github?: string
    twitter?: string
    linkedin?: string
    website?: string
  }
  settings: {
    notifications: {
      email: {
        communityUpdates: boolean
        eventReminders: boolean
        directMessages: boolean
      }
      push: boolean
      frequency: "realtime" | "daily" | "weekly" | "never"
    }
    appearance: {
      theme: "light" | "dark" | "system"
      fontSize: "small" | "medium" | "large"
    }
  }
  createdAt: string
  updatedAt: string
}

// In-memory database
class InMemoryDB {
  private resources: Map<string, Resource> = new Map()
  private events: Map<string, Event> = new Map()
  private posts: Map<string, Post> = new Map()
  private communities: Map<string, Community> = new Map()
  private users: Map<string, User> = new Map()

  constructor() {
    this.seedData()
  }

  // Seed with initial data
  private seedData() {
    // Seed users
    const user1: User = {
      id: "user1",
      firstName: "John",
      lastName: "Doe",
      displayName: "johndoe",
      email: "john.doe@example.com",
      bio: "Full-stack developer with a passion for building user-friendly applications.",
      location: "San Francisco, USA",
      avatar: "/placeholder.svg?height=128&width=128",
      skills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "Tailwind CSS"],
      social: {
        github: "johndoe",
        twitter: "johndoe",
        linkedin: "johndoe",
        website: "https://johndoe.dev",
      },
      settings: {
        notifications: {
          email: {
            communityUpdates: true,
            eventReminders: true,
            directMessages: true,
          },
          push: false,
          frequency: "daily",
        },
        appearance: {
          theme: "system",
          fontSize: "medium",
        },
      },
      createdAt: new Date(2023, 0, 15).toISOString(),
      updatedAt: new Date(2023, 0, 15).toISOString(),
    }

    const user2: User = {
      id: "user2",
      firstName: "Jane",
      lastName: "Smith",
      displayName: "janesmith",
      email: "jane.smith@example.com",
      bio: "UX/UI designer focused on creating intuitive user experiences.",
      location: "New York, USA",
      avatar: "/placeholder.svg?height=128&width=128",
      skills: ["UI Design", "UX Research", "Figma", "Adobe XD", "Prototyping"],
      social: {
        github: "janesmith",
        twitter: "janesmith",
        linkedin: "janesmith",
      },
      settings: {
        notifications: {
          email: {
            communityUpdates: true,
            eventReminders: true,
            directMessages: true,
          },
          push: true,
          frequency: "realtime",
        },
        appearance: {
          theme: "light",
          fontSize: "medium",
        },
      },
      createdAt: new Date(2023, 1, 20).toISOString(),
      updatedAt: new Date(2023, 1, 20).toISOString(),
    }

    this.users.set(user1.id, user1)
    this.users.set(user2.id, user2)

    // Seed communities
    const community1: Community = {
      id: "comm1",
      name: "Developers",
      description: "A community for software developers to share knowledge and collaborate.",
      logoUrl: "/placeholder.svg?height=200&width=200",
      bannerUrl: "/placeholder.svg?height=300&width=1200",
      category: "technology",
      tags: ["programming", "software", "development"],
      privacy: "public",
      rules: "Be respectful. Share knowledge. No spam.",
      createdBy: "user1",
      members: [
        {
          userId: "user1",
          role: "admin",
          joinedAt: new Date(2023, 0, 15).toISOString(),
          status: "active",
        },
        {
          userId: "user2",
          role: "member",
          joinedAt: new Date(2023, 1, 25).toISOString(),
          status: "active",
        },
      ],
      createdAt: new Date(2023, 0, 15).toISOString(),
      updatedAt: new Date(2023, 0, 15).toISOString(),
    }

    const community2: Community = {
      id: "comm2",
      name: "UI/UX Designers",
      description: "A community for designers to share work and get feedback.",
      logoUrl: "/placeholder.svg?height=200&width=200",
      bannerUrl: "/placeholder.svg?height=300&width=1200",
      category: "design",
      tags: ["design", "ui", "ux", "figma"],
      privacy: "public",
      createdBy: "user2",
      members: [
        {
          userId: "user2",
          role: "admin",
          joinedAt: new Date(2023, 1, 20).toISOString(),
          status: "active",
        },
        {
          userId: "user1",
          role: "member",
          joinedAt: new Date(2023, 2, 5).toISOString(),
          status: "active",
        },
      ],
      createdAt: new Date(2023, 1, 20).toISOString(),
      updatedAt: new Date(2023, 1, 20).toISOString(),
    }

    this.communities.set(community1.id, community1)
    this.communities.set(community2.id, community2)

    // Seed posts
    const post1: Post = {
      id: "post1",
      title: "Getting Started with Next.js 13",
      content: "Learn how to build modern web applications with Next.js 13 and its new App Router...",
      mediaUrls: [],
      category: "tutorial",
      tags: ["nextjs", "react", "webdev"],
      communityId: "comm1",
      createdBy: "user1",
      likes: ["user2"],
      comments: [
        {
          id: "comment1",
          content: "Great tutorial! Very helpful for beginners.",
          createdBy: "user2",
          createdAt: new Date(2023, 3, 12).toISOString(),
          updatedAt: new Date(2023, 3, 12).toISOString(),
        },
      ],
      createdAt: new Date(2023, 3, 10).toISOString(),
      updatedAt: new Date(2023, 3, 10).toISOString(),
    }

    const post2: Post = {
      id: "post2",
      title: "The Power of Tailwind CSS",
      content: "Discover how Tailwind CSS can speed up your development workflow and create beautiful designs...",
      mediaUrls: ["/placeholder.svg?height=400&width=800"],
      category: "article",
      tags: ["css", "tailwind", "frontend"],
      communityId: "comm1",
      createdBy: "user1",
      likes: ["user2"],
      comments: [],
      createdAt: new Date(2023, 3, 5).toISOString(),
      updatedAt: new Date(2023, 3, 5).toISOString(),
    }

    this.posts.set(post1.id, post1)
    this.posts.set(post2.id, post2)

    // Seed events
    const event1: Event = {
      id: "event1",
      title: "Web Development Workshop",
      description: "Learn the fundamentals of web development in this hands-on workshop.",
      startDate: new Date(2023, 5, 15).toISOString(),
      startTime: "10:00",
      endTime: "16:00",
      isVirtual: false,
      location: "Innovation Center, San Francisco",
      category: "workshop",
      capacity: 30,
      communityId: "comm1",
      createdBy: "user1",
      attendees: ["user1", "user2"],
      createdAt: new Date(2023, 4, 1).toISOString(),
      updatedAt: new Date(2023, 4, 1).toISOString(),
    }

    const event2: Event = {
      id: "event2",
      title: "React Meetup",
      description: "Monthly meetup for React developers to network and share knowledge.",
      startDate: new Date(2023, 5, 20).toISOString(),
      startTime: "18:30",
      endTime: "20:30",
      isVirtual: true,
      meetingLink: "https://zoom.us/j/123456789",
      category: "meetup",
      communityId: "comm1",
      createdBy: "user1",
      attendees: ["user1"],
      createdAt: new Date(2023, 4, 10).toISOString(),
      updatedAt: new Date(2023, 4, 10).toISOString(),
    }

    this.events.set(event1.id, event1)
    this.events.set(event2.id, event2)

    // Seed resources
    const resource1: Resource = {
      id: "res1",
      title: "Next.js Documentation",
      description: "Official documentation for Next.js framework.",
      url: "https://nextjs.org/docs",
      category: "documentation",
      tags: ["nextjs", "react", "docs"],
      createdBy: "user1",
      communityId: "comm1",
      createdAt: new Date(2023, 2, 15).toISOString(),
      updatedAt: new Date(2023, 2, 15).toISOString(),
    }

    const resource2: Resource = {
      id: "res2",
      title: "UI Design Principles",
      description: "A comprehensive guide to UI design principles and best practices.",
      fileUrl: "/files/ui-design-principles.pdf",
      category: "ebook",
      tags: ["design", "ui", "principles"],
      createdBy: "user2",
      communityId: "comm2",
      createdAt: new Date(2023, 2, 20).toISOString(),
      updatedAt: new Date(2023, 2, 20).toISOString(),
    }

    this.resources.set(resource1.id, resource1)
    this.resources.set(resource2.id, resource2)
  }

  // Resource methods
  getAllResources(): Resource[] {
    return Array.from(this.resources.values())
  }

  getResourceById(id: string): Resource | undefined {
    return this.resources.get(id)
  }

  getResourcesByCommunity(communityId: string): Resource[] {
    return Array.from(this.resources.values()).filter((resource) => resource.communityId === communityId)
  }

  createResource(resource: Omit<Resource, "id" | "createdAt" | "updatedAt">): Resource {
    const id = `res${this.resources.size + 1}`
    const now = new Date().toISOString()
    const newResource: Resource = {
      ...resource,
      id,
      createdAt: now,
      updatedAt: now,
    }
    this.resources.set(id, newResource)
    return newResource
  }

  updateResource(id: string, data: Partial<Resource>): Resource | undefined {
    const resource = this.resources.get(id)
    if (!resource) return undefined

    const updatedResource: Resource = {
      ...resource,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    this.resources.set(id, updatedResource)
    return updatedResource
  }

  deleteResource(id: string): boolean {
    return this.resources.delete(id)
  }

  // Event methods
  getAllEvents(): Event[] {
    return Array.from(this.events.values())
  }

  getEventById(id: string): Event | undefined {
    return this.events.get(id)
  }

  getEventsByCommunity(communityId: string): Event[] {
    return Array.from(this.events.values()).filter((event) => event.communityId === communityId)
  }

  createEvent(event: Omit<Event, "id" | "createdAt" | "updatedAt">): Event {
    const id = `event${this.events.size + 1}`
    const now = new Date().toISOString()
    const newEvent: Event = {
      ...event,
      id,
      createdAt: now,
      updatedAt: now,
    }
    this.events.set(id, newEvent)
    return newEvent
  }

  updateEvent(id: string, data: Partial<Event>): Event | undefined {
    const event = this.events.get(id)
    if (!event) return undefined

    const updatedEvent: Event = {
      ...event,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    this.events.set(id, updatedEvent)
    return updatedEvent
  }

  deleteEvent(id: string): boolean {
    return this.events.delete(id)
  }

  // Post methods
  getAllPosts(): Post[] {
    return Array.from(this.posts.values())
  }

  getPostById(id: string): Post | undefined {
    return this.posts.get(id)
  }

  getPostsByCommunity(communityId: string): Post[] {
    return Array.from(this.posts.values()).filter((post) => post.communityId === communityId)
  }

  createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt" | "likes" | "comments">): Post {
    const id = `post${this.posts.size + 1}`
    const now = new Date().toISOString()
    const newPost: Post = {
      ...post,
      id,
      likes: [],
      comments: [],
      createdAt: now,
      updatedAt: now,
    }
    this.posts.set(id, newPost)
    return newPost
  }

  updatePost(id: string, data: Partial<Post>): Post | undefined {
    const post = this.posts.get(id)
    if (!post) return undefined

    const updatedPost: Post = {
      ...post,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    this.posts.set(id, updatedPost)
    return updatedPost
  }

  deletePost(id: string): boolean {
    return this.posts.delete(id)
  }

  // Community methods
  getAllCommunities(): Community[] {
    return Array.from(this.communities.values())
  }

  getCommunityById(id: string): Community | undefined {
    return this.communities.get(id)
  }

  createCommunity(community: Omit<Community, "id" | "createdAt" | "updatedAt" | "members">): Community {
    const id = `comm${this.communities.size + 1}`
    const now = new Date().toISOString()
    const newCommunity: Community = {
      ...community,
      id,
      members: [
        {
          userId: community.createdBy,
          role: "admin",
          joinedAt: now,
          status: "active",
        },
      ],
      createdAt: now,
      updatedAt: now,
    }
    this.communities.set(id, newCommunity)
    return newCommunity
  }

  updateCommunity(id: string, data: Partial<Community>): Community | undefined {
    const community = this.communities.get(id)
    if (!community) return undefined

    const updatedCommunity: Community = {
      ...community,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    this.communities.set(id, updatedCommunity)
    return updatedCommunity
  }

  deleteCommunity(id: string): boolean {
    return this.communities.delete(id)
  }

  // Community member methods
  getCommunityMembers(communityId: string): (Member & { user: User })[] {
    const community = this.communities.get(communityId)
    if (!community) return []

    return community.members
      .map((member) => {
        const user = this.users.get(member.userId)
        if (!user) return null
        return {
          ...member,
          user,
        }
      })
      .filter((member): member is Member & { user: User } => member !== null)
  }

  addCommunityMember(communityId: string, userId: string, role: Member["role"] = "member"): Community | undefined {
    const community = this.communities.get(communityId)
    if (!community) return undefined

    const user = this.users.get(userId)
    if (!user) return undefined

    // Check if user is already a member
    if (community.members.some((member) => member.userId === userId)) {
      return community
    }

    const now = new Date().toISOString()
    const newMember: Member = {
      userId,
      role,
      joinedAt: now,
      status: "active",
    }

    const updatedCommunity: Community = {
      ...community,
      members: [...community.members, newMember],
      updatedAt: now,
    }

    this.communities.set(communityId, updatedCommunity)
    return updatedCommunity
  }

  updateCommunityMember(communityId: string, userId: string, data: Partial<Member>): Community | undefined {
    const community = this.communities.get(communityId)
    if (!community) return undefined

    const memberIndex = community.members.findIndex((member) => member.userId === userId)
    if (memberIndex === -1) return undefined

    const updatedMembers = [...community.members]
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      ...data,
    }

    const updatedCommunity: Community = {
      ...community,
      members: updatedMembers,
      updatedAt: new Date().toISOString(),
    }

    this.communities.set(communityId, updatedCommunity)
    return updatedCommunity
  }

  removeCommunityMember(communityId: string, userId: string): Community | undefined {
    const community = this.communities.get(communityId)
    if (!community) return undefined

    const updatedCommunity: Community = {
      ...community,
      members: community.members.filter((member) => member.userId !== userId),
      updatedAt: new Date().toISOString(),
    }

    this.communities.set(communityId, updatedCommunity)
    return updatedCommunity
  }

  // User methods
  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id)
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email === email)
  }

  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const id = `user${this.users.size + 1}`
    const now = new Date().toISOString()
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now,
    }
    this.users.set(id, newUser)
    return newUser
  }

  updateUser(id: string, data: Partial<User>): User | undefined {
    const user = this.users.get(id)
    if (!user) return undefined

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id)
  }

  // User settings methods
  updateUserSettings(userId: string, settings: Partial<User["settings"]>): User | undefined {
    const user = this.users.get(userId)
    if (!user) return undefined

    const updatedUser: User = {
      ...user,
      settings: {
        ...user.settings,
        ...settings,
        notifications: {
          ...user.settings.notifications,
          ...settings.notifications,
        },
      },
      updatedAt: new Date().toISOString(),
    }

    this.users.set(userId, updatedUser)
    return updatedUser
  }
}

// Create and export a singleton instance
const db = new InMemoryDB()
export default db
