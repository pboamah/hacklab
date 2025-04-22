"use client"

import type React from "react"

import { observer } from "mobx-react-lite"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getBrowserClient } from "@/lib/supabase"
import { ClientOnly } from "@/lib/is-client-component"

interface Badge {
  id: string
  name: string
  description: string
  requirement: string
  points_value: number
  image_url?: string
  created_at: string
  updated_at: string
}

const BadgesAdminPage = observer(() => {
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requirement: "",
    points_value: 0,
    image_url: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    setIsLoading(true)
    try {
      const supabase = getBrowserClient()
      const { data, error } = await supabase.from("badges").select("*").order("points_value", { ascending: true })

      if (error) throw error
      setBadges(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch badges",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points_value" ? Number.parseInt(value, 10) || 0 : value,
    }))
  }

  const handleEditBadge = (badge: Badge) => {
    setSelectedBadge(badge)
    setFormData({
      name: badge.name,
      description: badge.description,
      requirement: badge.requirement,
      points_value: badge.points_value,
      image_url: badge.image_url || "",
    })
    setIsDialogOpen(true)
  }

  const handleCreateBadge = () => {
    setSelectedBadge(null)
    setFormData({
      name: "",
      description: "",
      requirement: "",
      points_value: 0,
      image_url: "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const supabase = getBrowserClient()

      if (selectedBadge) {
        // Update existing badge
        const { error } = await supabase
          .from("badges")
          .update({
            name: formData.name,
            description: formData.description,
            requirement: formData.requirement,
            points_value: formData.points_value,
            image_url: formData.image_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedBadge.id)

        if (error) throw error
        toast({ title: "Success", description: "Badge updated successfully" })
      } else {
        // Create new badge
        const { error } = await supabase.from("badges").insert({
          name: formData.name,
          description: formData.description,
          requirement: formData.requirement,
          points_value: formData.points_value,
          image_url: formData.image_url || null,
        })

        if (error) throw error
        toast({ title: "Success", description: "Badge created successfully" })
      }

      setIsDialogOpen(false)
      fetchBadges()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save badge",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBadge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this badge?")) return

    try {
      const supabase = getBrowserClient()
      const { error } = await supabase.from("badges").delete().eq("id", id)

      if (error) throw error
      toast({ title: "Success", description: "Badge deleted successfully" })
      fetchBadges()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete badge",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardShell>
      <AdminLayout>
        <div className="container py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Badges</h1>
            <Button onClick={handleCreateBadge}>
              <Plus className="mr-2 h-4 w-4" />
              Create Badge
            </Button>
          </div>

          <ClientOnly>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 w-32 bg-muted rounded mb-2"></div>
                      <div className="h-4 w-48 bg-muted rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 w-full bg-muted rounded mb-2"></div>
                      <div className="h-4 w-3/4 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                  <Card key={badge.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{badge.name}</CardTitle>
                          <CardDescription>{badge.points_value} points</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditBadge(badge)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteBadge(badge.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div
                            className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
                            style={{
                              backgroundImage: badge.image_url ? `url(${badge.image_url})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {!badge.image_url && (
                              <span className="text-lg font-bold">{badge.name.substring(0, 2)}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{badge.description}</p>
                          <p className="text-xs">Requirement: {badge.requirement}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedBadge ? "Edit Badge" : "Create Badge"}</DialogTitle>
                  <DialogDescription>
                    {selectedBadge ? "Update the badge details below." : "Fill in the details to create a new badge."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="requirement">Requirement</Label>
                      <Input
                        id="requirement"
                        name="requirement"
                        value={formData.requirement}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="points_value">Points Value</Label>
                      <Input
                        id="points_value"
                        name="points_value"
                        type="number"
                        min="0"
                        value={String(formData.points_value)}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image_url">Image URL (optional)</Label>
                      <Input
                        id="image_url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        placeholder="Leave blank to auto-generate"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{selectedBadge ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </ClientOnly>
        </div>
      </AdminLayout>
    </DashboardShell>
  )
})

export default BadgesAdminPage
