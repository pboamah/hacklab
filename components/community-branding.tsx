"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Paintbrush, Upload, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { useBrandingStore } from "@/lib/store"
import { ColorPicker } from "@/components/ui/color-picker"

interface CommunityBrandingProps {
  communityId: string
}

export const CommunityBranding = observer(({ communityId }: CommunityBrandingProps) => {
  const brandingStore = useBrandingStore()

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [primaryColor, setPrimaryColor] = useState("#0f172a")
  const [secondaryColor, setSecondaryColor] = useState("#6366f1")
  const [customDomain, setCustomDomain] = useState("")
  const [isCustomizing, setIsCustomizing] = useState(false)

  useEffect(() => {
    const fetchBranding = async () => {
      const settings = await brandingStore.fetchBrandingSettings(communityId)
      setPrimaryColor(settings.primary_color || "#0f172a")
      setSecondaryColor(settings.secondary_color || "#6366f1")
      setCustomDomain(settings.custom_domain || "")
    }

    fetchBranding()
  }, [brandingStore, communityId])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  const handleSaveBranding = async () => {
    try {
      // Update branding settings
      await brandingStore.updateBrandingSettings(communityId, {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        custom_domain: customDomain,
      })

      // Upload logo if changed
      if (logoFile) {
        await brandingStore.uploadBrandingAsset(communityId, logoFile, "logo")
      }

      // Upload banner if changed
      if (bannerFile) {
        await brandingStore.uploadBrandingAsset(communityId, bannerFile, "banner")
      }

      toast({
        title: "Branding updated",
        description: "Your community branding has been updated successfully.",
      })
      setIsCustomizing(false)
    } catch (error) {
      console.error("Error updating branding:", error)
      toast({
        title: "Error",
        description: "Failed to update branding. Please try again.",
        variant: "destructive",
      })
    }
  }

  const settings = brandingStore.getBrandingSettings(communityId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Community Branding</CardTitle>
            <CardDescription>Customize the look and feel of your community</CardDescription>
          </div>
          {!isCustomizing ? (
            <Button onClick={() => setIsCustomizing(true)}>
              <Paintbrush className="h-4 w-4 mr-2" />
              Customize
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsCustomizing(false)} disabled={brandingStore.isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSaveBranding} disabled={brandingStore.isLoading}>
                {brandingStore.isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isCustomizing ? (
          <Tabs defaultValue="visuals" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visuals">Visuals</TabsTrigger>
              <TabsTrigger value="domain">Domain</TabsTrigger>
            </TabsList>
            <TabsContent value="visuals" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md border overflow-hidden flex items-center justify-center bg-muted">
                    {logoPreview || settings.logo_url ? (
                      <img
                        src={logoPreview || settings.logo_url}
                        alt="Community logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Input type="file" accept="image/*" onChange={handleLogoChange} className="max-w-xs" />
                    <p className="text-xs text-muted-foreground mt-1">Recommended size: 200x200px. Max size: 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Banner</Label>
                <div className="flex flex-col gap-4">
                  <div className="h-32 w-full rounded-md border overflow-hidden flex items-center justify-center bg-muted">
                    {bannerPreview || settings.banner_url ? (
                      <img
                        src={bannerPreview || settings.banner_url}
                        alt="Community banner"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Input type="file" accept="image/*" onChange={handleBannerChange} className="max-w-xs" />
                    <p className="text-xs text-muted-foreground mt-1">Recommended size: 1200x300px. Max size: 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPicker label="Primary Color" value={primaryColor} onChange={setPrimaryColor} />

                <ColorPicker label="Secondary Color" value={secondaryColor} onChange={setSecondaryColor} />
              </div>
            </TabsContent>

            <TabsContent value="domain" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Custom Domain</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="yourcommunity.com"
                    className="max-w-xs"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Enter your domain without http:// or https://</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Enable Custom Domain</Label>
                  <Switch
                    checked={!!customDomain}
                    onCheckedChange={(checked) => {
                      if (!checked) setCustomDomain("")
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You'll need to configure DNS settings with your domain provider.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Logo</h3>
                <div className="h-20 w-20 rounded-md border overflow-hidden flex items-center justify-center bg-muted">
                  {settings.logo_url ? (
                    <img
                      src={settings.logo_url || "/placeholder.svg"}
                      alt="Community logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Banner</h3>
                <div className="h-20 w-full rounded-md border overflow-hidden flex items-center justify-center bg-muted">
                  {settings.banner_url ? (
                    <img
                      src={settings.banner_url || "/placeholder.svg"}
                      alt="Community banner"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Colors</h3>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-md border"
                    style={{ backgroundColor: settings.primary_color || "#0f172a" }}
                  />
                  <div
                    className="h-6 w-6 rounded-md border"
                    style={{ backgroundColor: settings.secondary_color || "#6366f1" }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Custom Domain</h3>
                <p className="text-sm">{settings.custom_domain || "No custom domain configured"}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})
