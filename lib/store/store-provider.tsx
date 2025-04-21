"use client"

import React, { createContext, useContext, type ReactNode } from "react"
import { RootStore } from "./index"

// Create a context for the root store
const StoreContext = createContext<RootStore | null>(null)

// Create a provider component
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize the store (only once)
  const [store] = React.useState(() => new RootStore())

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

// Create a hook to use the store
export const useStore = (): RootStore => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return store
}
