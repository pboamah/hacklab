"use client"

import React, { createContext, useContext, type ReactNode } from "react"
import { RootStore } from "./root-store"

// Create a context for the root store
const StoreContext = createContext<RootStore | undefined>(undefined)

// Create a provider component
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Create a new instance of the root store
  const rootStore = React.useMemo(() => new RootStore(), [])

  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
}

// Create a hook to use the store context
export const useStore = (): RootStore => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

// Create hooks for individual stores
export const useUserStore = () => useStore().userStore
export const useCommunityStore = () => useStore().communityStore
export const useEventStore = () => useStore().eventStore
export const useHackathonStore = () => useStore().hackathonStore
export const useJobStore = () => useStore().jobStore
export const usePostStore = () => useStore().postStore
export const useAdminStore = () => useStore().adminStore
