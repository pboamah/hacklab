"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { configure } from "mobx"
import { enableStaticRendering } from "mobx-react-lite"
import { RootStore } from "./root-store"

// Configure MobX
configure({
  enforceActions: "observed",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: false,
})

// Enable static rendering for server-side rendering
enableStaticRendering(typeof window === "undefined")

// Create a singleton instance of the root store
let store: RootStore | undefined = undefined

function initializeStore(): RootStore {
  const _store = store ?? new RootStore()

  // For SSR, always create a new store
  if (typeof window === "undefined") return _store

  // Create the store once in the client
  if (!store) store = _store

  return _store
}

// Create a React Context for the store
export const StoreContext = createContext<RootStore | undefined>(undefined)

// Create a provider component
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = initializeStore()

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

// Hook to use the store in components
export function useStore(): RootStore {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

// Export individual store hooks for convenience
export function useUserStore() {
  const { userStore } = useStore()
  return userStore
}

export function useCommunityStore() {
  const { communityStore } = useStore()
  return communityStore
}

export function useEventStore() {
  const { eventStore } = useStore()
  return eventStore
}

export function useHackathonStore() {
  const { hackathonStore } = useStore()
  return hackathonStore
}

export function useJobStore() {
  const { jobStore } = useStore()
  return jobStore
}

export function usePostStore() {
  const { postStore } = useStore()
  return postStore
}

export function useAdminStore() {
  const { adminStore } = useStore()
  return adminStore
}

export function useMessageStore() {
  const { messageStore } = useStore()
  return messageStore
}

export function useReactionStore() {
  const { reactionStore } = useStore()
  return reactionStore
}

export function useBrandingStore() {
  const { brandingStore } = useStore()
  return brandingStore
}

export function useProfileStore() {
  const { profileStore } = useStore()
  return profileStore
}

export function useCommentStore() {
  const { commentStore } = useStore()
  return commentStore
}

export function useForumStore() {
  const { forumStore } = useStore()
  return forumStore
}

export function useGroupStore() {
  const { groupStore } = useStore()
  return groupStore
}

export function useResourceStore() {
  const { resourceStore } = useStore()
  return resourceStore
}

export function usePollStore() {
  const { pollStore } = useStore()
  return pollStore
}

export * from "./root-store"
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
