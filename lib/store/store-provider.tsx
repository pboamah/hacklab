"use client"

import type React from "react"

import { useSyncExternalStore } from "react"
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

// Hook to use the store in components
export function useStore(): RootStore {
  const store = initializeStore()
  return useSyncExternalStore(
    () => (callback: () => void) => {
      // Subscribe to changes on the store
      const unsubscribe = () => {}
      return unsubscribe
    },
    () => store,
  )
}

// Create hooks for individual stores
export const useUserStore = () => useStore().userStore
export const useCommunityStore = () => useStore().communityStore
export const useEventStore = () => useStore().eventStore
export const useHackathonStore = () => useStore().hackathonStore
export const useJobStore = () => useStore().jobStore
export const usePostStore = () => useStore().postStore
export const useAdminStore = () => useStore().adminStore
export const useMessageStore = () => useStore().messageStore
export const useReactionStore = () => useStore().reactionStore
export const useBrandingStore = () => useStore().brandingStore
export const useProfileStore = () => useStore().profileStore
export const useCommentStore = () => useStore().commentStore
export const useForumStore = () => useStore().forumStore
export const useGroupStore = () => useStore().groupStore
export const useResourceStore = () => useStore().resourceStore
export const usePollStore = () => useStore().pollStore

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

interface StoreProviderProps {
  children: React.ReactNode
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <>{children}</>
}
