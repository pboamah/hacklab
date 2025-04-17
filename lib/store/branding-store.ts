import { makeAutoObservable, runInAction } from "mobx"
import { getBrowserClient } from "@/lib/supabase/client"
import type { RootStore } from "./root-store"

export interface BrandingSettings {
  primary_color?: string
  secondary_color?: string
  logo_url?: string
  banner_url?: string
  custom_domain?: string
  custom_css?: string
  favicon_url?: string
}

export class BrandingStore {
  brandingSettings: Map<string, BrandingSettings> = new Map() // communityId -> settings
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
  setLoading = (loading: boolean) => {
    this.isLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  setBrandingSettings = (communityId: string, settings: BrandingSettings) => {
    this.brandingSettings.set(communityId, settings)
  }

  // Async actions
  fetchBrandingSettings = async (communityId: string) => {
    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()
      const { data, error } = await supabase.from("communities").select("branding").eq("id", communityId).single()

      if (error) throw error

      runInAction(() => {
        this.setBrandingSettings(communityId, data?.branding || {})
      })

      return data?.branding || {}
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to fetch branding settings")
      })
      return {}
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  updateBrandingSettings = async (communityId: string, settings: Partial<BrandingSettings>) => {
    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()
      const currentSettings = this.getBrandingSettings(communityId)
      const updatedSettings = { ...currentSettings, ...settings }

      const { data, error } = await supabase
        .from("communities")
        .update({ branding: updatedSettings })
        .eq("id", communityId)
        .select("branding")
        .single()

      if (error) throw error

      runInAction(() => {
        this.setBrandingSettings(communityId, data?.branding || {})
      })

      return data?.branding || {}
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || "Failed to update branding settings")
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  uploadBrandingAsset = async (communityId: string, file: File, type: "logo" | "banner" | "favicon") => {
    this.setLoading(true)
    this.setError(null)

    try {
      const supabase = getBrowserClient()
      const fileName = `community-${type}-${communityId}-${Date.now()}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("community-assets")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("community-assets").getPublicUrl(fileName)
      const publicUrl = urlData.publicUrl

      // Update branding settings with the new URL
      const settings: Partial<BrandingSettings> = {}
      if (type === "logo") {
        settings.logo_url = publicUrl
      } else if (type === "banner") {
        settings.banner_url = publicUrl
      } else if (type === "favicon") {
        settings.favicon_url = publicUrl
      }

      await this.updateBrandingSettings(communityId, settings)

      return publicUrl
    } catch (error: any) {
      runInAction(() => {
        this.setError(error.message || `Failed to upload ${type}`)
      })
      return null
    } finally {
      runInAction(() => {
        this.setLoading(false)
      })
    }
  }

  // Computed properties
  getBrandingSettings = (communityId: string) => {
    return this.brandingSettings.get(communityId) || {}
  }
}
