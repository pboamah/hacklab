"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Copy, Plus, Trash2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"

export default function CreateTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [selectedHackathon, setSelectedHackathon] = useState("")
  const [invitedMembers, setInvitedMembers] = useState<string[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteLink, setInviteLink] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate team creation
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Team created successfully",
        description: "Your team has been created and invitations sent to members.",
      })
      router.push("/hackathons/teams/1")
    }, 1000)
  }

  const handleAddMember = () => {
    if (inviteEmail && !invitedMembers.includes(inviteEmail)) {
      setInvitedMembers([...invitedMembers, inviteEmail])
      setInviteEmail("")
    }
  }

  const handleRemoveMember = (email: string) => {
    setInvitedMembers(invitedMembers.filter((member) => member !== email))
  }

  const generateInviteLink = () => {
    const link = `https://hacklabconnect.com/invite/${Math.random().toString(36).substring(2, 15)}`
    setInviteLink(link)
    toast({
      title: "Invite link generated",
      description: "Link has been copied to clipboard.",
    })
    navigator.clipboard.writeText(link)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create a Team" text="Form a team of up to 5 members to participate in hackathons." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
                <CardDescription>Provide details about your team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    placeholder="Enter team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-description">Team Description</Label>
                  <Textarea
                    id="team-description"
                    placeholder="Briefly describe your team and skills"
                    rows={3}
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hackathon">Select Hackathon</Label>
                  <Select value={selectedHackathon} onValueChange={setSelectedHackathon}>
                    <SelectTrigger id="hackathon">
                      <SelectValue placeholder="Select a hackathon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">AI Solutions Hackathon</SelectItem>
                      <SelectItem value="2">FinTech Innovation Challenge</SelectItem>
                      <SelectItem value="3">Sustainable Development Hackathon</SelectItem>
                      <SelectItem value="4">Mobile Health Solutions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/hackathons">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isLoading || !teamName || !selectedHackathon}>
                  {isLoading ? "Creating..." : "Create Team"}
                </Button>
              </CardFooter>
            </Card>
          </form>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Invite Team Members</CardTitle>
              <CardDescription>Invite up to 4 additional members to join your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button type="button" onClick={handleAddMember} disabled={!inviteEmail || invitedMembers.length >= 4}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Invited Members ({invitedMembers.length}/4)</Label>
                {invitedMembers.length > 0 ? (
                  <div className="space-y-2">
                    {invitedMembers.map((email) => (
                      <div key={email} className="flex items-center justify-between p-2 border rounded-md">
                        <span>{email}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(email)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No members invited yet</p>
                )}
              </div>

              <div className="pt-2">
                <Label>Or generate an invitation link</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={inviteLink} placeholder="Generate a link to invite team members" readOnly />
                  <Button type="button" onClick={generateInviteLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Team Requirements</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Teams can have 1-5 members</li>
                  <li>All team members must be registered on Hacklab Connect</li>
                  <li>Each person can only be part of one team per hackathon</li>
                  <li>Team composition can be changed until the hackathon starts</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Team Roles</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Team Creator: Manages team composition and submissions</li>
                  <li>Team Members: Collaborate on project development</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Submission Process</h3>
                <p className="text-sm">Once your team is complete, you'll be able to:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Submit project details</li>
                  <li>Upload code repositories</li>
                  <li>Share presentation materials</li>
                  <li>Provide demo links</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Having trouble forming a team or have questions about the hackathon?
              </p>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Find Team Members
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
