"use client"

import Link from "next/link"
import { Calendar, FileText, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminLayout } from "@/components/admin-layout"

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardHeader heading="Admin Dashboard" text="Manage platform analytics, users, and content">
        <Button variant="outline" asChild>
          <Link href="/">View Public Website</Link>
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">
            <Settings className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Key metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User management tools will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Moderate user-generated content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content moderation tools will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>Manage events and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Event management tools will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}
