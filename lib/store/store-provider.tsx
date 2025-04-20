"use client"

import { createContext, useContext, type ReactNode } from "react"
import { enableStaticRendering } from "mobx-react-lite"
import { isClient } from "../is-client"
import { headersStore, HeadersStore } from "./headers-store"
import { hackathonStore, HackathonStore } from "./hackathon-store"
import { jobStore, JobStore } from "./job-store"
import { adminStore, AdminStore } from "./admin-store"
import { reactionStore, ReactionStore } from "./reaction-store"

// Enable static rendering in SSR mode
enableStaticRendering(!isClient)

interface StoreContextValue {
  headersStore: HeadersStore
  hackathonStore: HackathonStore
  jobStore: JobStore
  adminStore: AdminStore
  reactionStore: ReactionStore
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const stores: StoreContextValue = {
    headersStore,
    hackathonStore,
    jobStore,
    adminStore,
    reactionStore,
  }

  return <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
}

export function useStores() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStores must be used within a StoreProvider")
  }
  return context
}

// Export store classes and instances
export { HeadersStore, headersStore }
export { HackathonStore, hackathonStore }
export { JobStore, jobStore }
export { AdminStore, adminStore }
export { ReactionStore, reactionStore }
