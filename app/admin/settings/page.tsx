"use client"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <AdminLayout>
      <DashboardHeader heading="Platform Settings" text="Configure and manage platform settings">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>Basic information about your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="Tech Community Ghana" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform-url">Platform URL</Label>
                  <Input id="platform-url" defaultValue="https://techcommunity.gh" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" defaultValue="admin@techcommunity.gh" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" defaultValue="support@techcommunity.gh" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-description">Platform Description</Label>
                <Textarea
                  id="platform-description"
                  defaultValue="Tech Community Ghana is a platform for tech enthusiasts, professionals, and learners to connect, share knowledge, and grow together."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registration Settings</CardTitle>
              <CardDescription>Configure user registration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="open-registration">Open Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to register on the platform</p>
                </div>
                <Switch id="open-registration" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-verification">Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                </div>
                <Switch id="email-verification" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="invite-only">Invite Only</Label>
                  <p className="text-sm text-muted-foreground">Restrict registration to users with invitation codes</p>
                </div>
                <Switch id="invite-only" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure platform security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require two-factor authentication for admin accounts</p>
                </div>
                <Switch id="two-factor" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-policy">Strong Password Policy</Label>
                  <p className="text-sm text-muted-foreground">Enforce strong password requirements for all users</p>
                </div>
                <Switch id="password-policy" defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" />
                <p className="text-sm text-muted-foreground">
                  Time in minutes before an inactive session is automatically logged out
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API access and keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-api">Enable API Access</Label>
                  <p className="text-sm text-muted-foreground">Allow external applications to access the API</p>
                </div>
                <Switch id="enable-api" defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    defaultValue="sk_live_51NzQjKLkjOiJKLjkLJKLjkLJKLjkLJKLjkLJKLjkLJKL"
                    type="password"
                    className="font-mono"
                  />
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep this key secret. It provides full access to your API.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Configure content moderation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-moderation">Automatic Content Moderation</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically filter content based on predefined rules
                  </p>
                </div>
                <Switch id="auto-moderation" defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="profanity-filter">Profanity Filter Level</Label>
                <Select defaultValue="moderate">
                  <SelectTrigger id="profanity-filter">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Strict</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="lenient">Lenient</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="user-reports">User Content Reporting</Label>
                  <p className="text-sm text-muted-foreground">Allow users to report inappropriate content</p>
                </div>
                <Switch id="user-reports" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Moderation</CardTitle>
              <CardDescription>Configure user moderation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-user-restrictions">New User Restrictions</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply posting restrictions to new users for the first 24 hours
                  </p>
                </div>
                <Switch id="new-user-restrictions" defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="spam-threshold">Spam Detection Threshold</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="spam-threshold">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (fewer false positives)</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low (aggressive detection)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="welcome-email">Welcome Email</Label>
                  <p className="text-sm text-muted-foreground">Send welcome email to new users</p>
                </div>
                <Switch id="welcome-email" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-reminders">Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send email reminders for upcoming events</p>
                </div>
                <Switch id="event-reminders" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="digest-email">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">Send weekly digest of platform activity</p>
                </div>
                <Switch id="digest-email" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Notifications</CardTitle>
              <CardDescription>Configure notifications for administrators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-user-notify">New User Registrations</Label>
                  <p className="text-sm text-muted-foreground">Notify admins of new user registrations</p>
                </div>
                <Switch id="new-user-notify" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="report-notify">Content Reports</Label>
                  <p className="text-sm text-muted-foreground">Notify admins of reported content</p>
                </div>
                <Switch id="report-notify" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="error-notify">System Errors</Label>
                  <p className="text-sm text-muted-foreground">Notify admins of system errors and issues</p>
                </div>
                <Switch id="error-notify" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Configure integrations with external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Google Analytics</Label>
                    <p className="text-sm text-muted-foreground">Track user activity with Google Analytics</p>
                  </div>
                  <Switch id="google-analytics" defaultChecked />
                </div>
                <div className="pt-2">
                  <Label htmlFor="ga-tracking-id">Tracking ID</Label>
                  <Input id="ga-tracking-id" defaultValue="UA-123456789-1" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mailchimp</Label>
                    <p className="text-sm text-muted-foreground">Sync users with Mailchimp for email campaigns</p>
                  </div>
                  <Switch id="mailchimp" />
                </div>
                <div className="pt-2">
                  <Label htmlFor="mailchimp-api-key">API Key</Label>
                  <Input id="mailchimp-api-key" placeholder="Enter Mailchimp API key" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Slack</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications and updates in your Slack workspace
                    </p>
                  </div>
                  <Switch id="slack" />
                </div>
                <div className="pt-2">
                  <Label htmlFor="slack-webhook">Webhook URL</Label>
                  <Input id="slack-webhook" placeholder="Enter Slack webhook URL" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Configure social media integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Twitter/X</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to share content on Twitter and sign in with Twitter
                    </p>
                  </div>
                  <Switch id="twitter" defaultChecked />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="twitter-api-key">API Key</Label>
                    <Input id="twitter-api-key" placeholder="Enter Twitter API key" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter-api-secret">API Secret</Label>
                    <Input id="twitter-api-secret" type="password" placeholder="Enter Twitter API secret" />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Facebook</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to share content on Facebook and sign in with Facebook
                    </p>
                  </div>
                  <Switch id="facebook" defaultChecked />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebook-app-id">App ID</Label>
                    <Input id="facebook-app-id" placeholder="Enter Facebook App ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook-app-secret">App Secret</Label>
                    <Input id="facebook-app-secret" type="password" placeholder="Enter Facebook App Secret" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}
