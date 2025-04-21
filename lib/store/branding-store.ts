import { makeAutoObservable } from "mobx"
import type { RootStore } from "./index"

export interface BrandingSettings {
  primaryColor: string
  secondaryColor: string
  logoUrl: string | null
  faviconUrl: string | null
  siteName: string
  siteDescription: string
  customCss: string | null
  customJs: string | null
}

export class BrandingStore {
  settings: BrandingSettings = {
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    logoUrl: null,
    faviconUrl: null,
    siteName: "Hacklab Connect",
    siteDescription: "A community platform for hackathons and tech events",
    customCss: null,
    customJs: null,
  }
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
  setSettings = (settings: Partial<BrandingSettings>) => {
    this.settings = { ...this.settings, ...settings }
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Async actions
  fetchBrandingSettings = async () => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 500))

      // No changes to settings for now, just simulating a fetch

      return this.settings
    } catch (error: any) {
      this.setError(error.message || "Failed to fetch branding settings")
      return null
    } finally {
      this.setLoading(false)
    }
  }

  updateBrandingSettings = async (settings: Partial<BrandingSettings>) => {
    this.setLoading(true)
    this.setError(null)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      this.setSettings(settings)
      return true
    } catch (error: any) {
      this.setError(error.message || "Failed to update branding settings")
      return false
    } finally {
      this.setLoading(false)
    }
  }
}
