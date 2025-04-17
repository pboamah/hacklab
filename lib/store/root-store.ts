"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { makeAutoObservable } from "mobx"

// Import all the store types we need
import { NotificationStore } from "./notification-store"
import { EventStore } from "./event-store"
import { UserStore } from "./user-store"
import { CommunityStore } from "./community-store"
import { MessageStore } from "./message-store"
import { GamificationStore } from "./gamification-store"
import { HackathonStore } from "./hackathon-store"
import { ForumStore } from "./forum-store"
import { GroupStore } from "./group-store"
import { PollStore } from "./poll-store"
import { ResourceStore } from "./resource-store"
import { BrandingStore } from "./branding-store"
import { ProfileStore } from "./profile-store"
import { ReactionStore } from "./reaction-store"
import { CommentStore } from "./comment-store"

// Define the RootStore class
export class RootStore {
  notificationStore: NotificationStore
  eventStore: EventStore
  userStore: UserStore
  communityStore: CommunityStore
  messageStore: MessageStore
  gamificationStore: GamificationStore
  hackathonStore: HackathonStore
  forumStore: ForumStore
  groupStore: GroupStore
  pollStore: PollStore
  resourceStore: ResourceStore
  brandingStore: BrandingStore
  profileStore: ProfileStore
  reactionStore: ReactionStore
  commentStore: CommentStore

  constructor() {
    // Initialize all stores
    this.notificationStore = new NotificationStore(this)
    this.eventStore = new EventStore(this)
    this.userStore = new UserStore(this)
    this.communityStore = new CommunityStore(this)
    this.messageStore = new MessageStore(this)
    this.gamificationStore = new GamificationStore(this)
    this.hackathonStore = new HackathonStore(this)
    this.forumStore = new ForumStore(this)
    this.groupStore = new GroupStore(this)
    this.pollStore = new PollStore(this)
    this.resourceStore = new ResourceStore(this)
    this.brandingStore = new BrandingStore(this)
    this.profileStore = new ProfileStore(this)
    this.reactionStore = new ReactionStore(this)
    this.commentStore = new CommentStore(this)

    makeAutoObservable(this)
  }
}

// Create a singleton instance
const rootStore = new RootStore()

// Create a context
export const StoreContext = createContext<RootStore>(rootStore)

// Export hooks for each store
export const useStore = () => useContext(StoreContext)
export const useNotificationStore = () => useContext(StoreContext).notificationStore
export const useEventStore = () => useContext(StoreContext).eventStore
export const useUserStore = () => useContext(StoreContext).userStore
export const useCommunityStore = () => useContext(StoreContext).communityStore
export const useMessageStore = () => useContext(StoreContext).messageStore
export const useGamificationStore = () => useContext(StoreContext).gamificationStore
export const useHackathonStore = () => useContext(StoreContext).hackathonStore
export const useForumStore = () => useContext(StoreContext).forumStore
export const useGroupStore = () => useContext(StoreContext).groupStore
export const usePollStore = () => useContext(StoreContext).pollStore
export const useResourceStore = () => useContext(StoreContext).resourceStore
export const useBrandingStore = () => useContext(StoreContext).brandingStore
export const useProfileStore = () => useContext(StoreContext).profileStore
export const useReactionStore = () => useContext(StoreContext).reactionStore
export const useCommentStore = () => useContext(StoreContext).commentStore

// Export the provider component
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
}

export * from "./user-store"
export * from "./community-store"
export * from "./event-store"
export * from "./hackathon-store"
export * from "./job-store"
export * from "./post-store"
export * from "./admin-store"
export * from "./message-store"
export * from "./reaction-store"
export * from "./branding-store"
export * from "./profile-store"
export * from "./comment-store"
export * from "./forum-store"
export * from "./group-store"
export * from "./resource-store"
export * from "./poll-store"
