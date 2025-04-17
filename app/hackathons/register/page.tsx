"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { observer } from "mobx-react-lite"
import { Info, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHackathonStore } from "@/lib/store/root-store"

const HackathonRegistrationPage = observer(() => {
  const router = useRouter()
  const { toast } = useToast()
  const hackathonStore = useHackathonStore()
  const [isLoading, setIsLoading] = useState(false)
  const [registrationType, setRegistrationType] = useState<"individual" | "team">("individual")
  const [teamOption, setTeamOption] = useState<"create" | "join">("create")
  const [inviteCode, setInviteCode] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState("")
  const [selectedHackathon, setSelectedHackathon] = useState("")

  useEffect(() => {
    hackathonStore.fetchUpcomingHackathons()
  }, [hackathonStore])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!acceptedTerms) {
      toast({
        title: "Terms and conditions required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    if (!selectedHackathon) {
      toast({
        title: "Hackathon selection required",
        description: "Please select a hackathon to register for.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (registrationType === "individual") {
        await hackathonStore.registerForHackathon(selectedHackathon, {
          track: selectedTrack,
        })

        toast({
          title: "Registration successful",
          description: "You've been registered for the hackathon.",
        })

        router.push(`/hackathons/${selectedHackathon}`)
      } else if (teamOption === "create") {
        // Register and then redirect to team creation
        await hackathonStore.registerForHackathon(selectedHackathon, {
          track: selectedTrack,
        })

        toast({
          title: "Registration successful",
          description: "Now create your team to complete registration.",
        })

        router.push("/hackathons/teams/create")
      } else {
        // Join existing team with invite code
        await hackathonStore.joinTeamWithCode(inviteCode)

        toast({
          title: "Team joined",
          description: "You've joined the team successfully.",
        })

        // Redirect to the team page - the team ID will be returned from the join action
        const teamId = hackathonStore.currentTeam?.id || "1"
        router.push(`/hackathons/teams/${teamId}`)
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Register for Hackathon" text="Join an upcoming hackathon to showcase your skills" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Registration Details</CardTitle>
                <CardDescription>Choose how you want to participate in the hackathon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="hackathon">Select Hackathon</Label>
                  <Select value={selectedHackathon} onValueChange={setSelectedHackathon}>
                    <SelectTrigger id="hackathon">
                      <SelectValue placeholder="Select a hackathon" />
                    </SelectTrigger>
                    <SelectContent>
                      {hackathonStore.upcomingHackathons.map((hackathon) => (
                        <SelectItem key={hackathon.id} value={hackathon.id}>
                          {hackathon.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Registration Type</Label>
                  <RadioGroup
                    defaultValue="individual"
                    value={registrationType}
                    onValueChange={(value) => setRegistrationType(value as "individual" | "team")}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-primary">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="flex-1 cursor-pointer">
                        <div className="font-medium">Individual Participant</div>
                        <div className="text-sm text-muted-foreground">
                          Register as an individual and get matched with a team or form a team later
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-primary">
                      <RadioGroupItem value="team" id="team" />
                      <Label htmlFor="team" className="flex-1 cursor-pointer">
                        <div className="font-medium">Team Registration</div>
                        <div className="text-sm text-muted-foreground">
                          Create a new team or join an existing team with an invite code
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {registrationType === "team" && (
                  <div className="space-y-3">
                    <Label>Team Option</Label>
                    <RadioGroup
                      defaultValue="create"
                      value={teamOption}
                      onValueChange={(value) => setTeamOption(value as "create" | "join")}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="create" id="create" />
                        <Label htmlFor="create" className="flex-1 cursor-pointer">
                          <div className="font-medium">Create a New Team</div>
                          <div className="text-sm text-muted-foreground">Form a new team and invite others to join</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="join" id="join" />
                        <Label htmlFor="join" className="flex-1 cursor-pointer">
                          <div className="font-medium">Join an Existing Team</div>
                          <div className="text-sm text-muted-foreground">Join a team using an invitation code</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {registrationType === "team" && teamOption === "join" && (
                  <div className="space-y-2">
                    <Label htmlFor="invite-code">Team Invitation Code</Label>
                    <Input
                      id="invite-code"
                      placeholder="Enter invitation code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      required={teamOption === "join"}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the invitation code provided by the team creator
                    </p>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <Label>Challenge Track</Label>
                  <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a challenge track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">AI for Healthcare</SelectItem>
                      <SelectItem value="education">EdTech Solutions</SelectItem>
                      <SelectItem value="finance">Financial Inclusion</SelectItem>
                      <SelectItem value="environment">Environmental Sustainability</SelectItem>
                      <SelectItem value="open">Open Innovation</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select the challenge track you're most interested in. You can change this later.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accept terms and conditions
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          privacy policy
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/hackathons">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Complete Registration"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedHackathon ? (
                <div className="space-y-2">
                  <h3 className="font-medium">Hackathon Details</h3>
                  {hackathonStore.upcomingHackathons
                    .filter((h) => h.id === selectedHackathon)
                    .map((hackathon) => (
                      <ul key={hackathon.id} className="space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Event:</span>
                          <span>{hackathon.name}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Dates:</span>
                          <span>
                            {hackathon.startDate} - {hackathon.endDate}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{hackathon.location || "Virtual"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Registration Deadline:</span>
                          <span>{hackathon.registrationDeadline || "TBD"}</span>
                        </li>
                      </ul>
                    ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Select a Hackathon</h3>
                  <p className="text-sm text-muted-foreground">
                    Please select a hackathon from the dropdown to see event details.
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Team Requirements</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Teams can have 1-5 members</li>
                  <li>All team members must be registered on Hacklab Connect</li>
                  <li>Each person can only be part of one team per hackathon</li>
                </ul>
              </div>

              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Registration Note</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        You can register as an individual now and join or create a team later. Team composition can be
                        changed until the hackathon starts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Having trouble registering or have questions about the hackathon?
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
})

export default HackathonRegistrationPage
