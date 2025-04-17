"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/file-uploader"
import DashboardShell from "@/components/dashboard-shell"

export default function AddResourcePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("file")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/resources")
    }, 1500)
  }

  return (
    <DashboardShell>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add Resource</h1>
            <p className="text-muted-foreground">Share knowledge with your community</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/resources")}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
            <CardDescription>Fill in the information about the resource you want to share</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter resource title" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe what this resource is about" rows={4} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="ebook">E-Book</SelectItem>
                        <SelectItem value="code">Code Sample</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="javascript, react, beginner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Resource Type</Label>
                  <Tabs defaultValue="file" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="file">Upload File</TabsTrigger>
                      <TabsTrigger value="link">External Link</TabsTrigger>
                    </TabsList>
                    <TabsContent value="file" className="pt-4">
                      <FileUploader />
                      <p className="text-sm text-muted-foreground mt-2">
                        Max file size: 10MB. Supported formats: PDF, DOC, DOCX, PPT, PPTX, ZIP
                      </p>
                    </TabsContent>
                    <TabsContent value="link" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="url">Resource URL</Label>
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://example.com/resource"
                          disabled={activeTab !== "link"}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="community">Share with Community</Label>
                  <Select>
                    <SelectTrigger id="community">
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Communities</SelectItem>
                      <SelectItem value="developers">Developers</SelectItem>
                      <SelectItem value="designers">Designers</SelectItem>
                      <SelectItem value="product">Product Managers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Add Resource"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
