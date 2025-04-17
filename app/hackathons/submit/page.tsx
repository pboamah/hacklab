"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { observer } from "mobx-react-lite"
import { ArrowLeft, ArrowRight, Check, FileText, Github, Link2, Upload, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useHackathonStore } from "@/lib/store/root-store"

const SubmitProjectPage = observer(() => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEdit = searchParams.get("edit") === "true"
  const { toast } = useToast()
  const hackathonStore = useHackathonStore()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1: Basic Information
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [toolsUsed, setToolsUsed] = useState("")

  // Step 2: Project Materials
  const [repoLink, setRepoLink] = useState("")
  const [demoLink, setDemoLink] = useState("")
  const [videoLink, setVideoLink] = useState("")
  const [presentationFile, setPresentationFile] = useState<File | null>(null)

  // Step 3: Additional Information
  const [judgeInstructions, setJudgeInstructions] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")

  useEffect(() => {
    // If editing, fetch the current submission
    if (isEdit && hackathonStore.currentTeam?.submission) {
      const submission = hackathonStore.currentTeam.submission
      setProjectName(submission.name || "")
      setProjectDescription(submission.description || "")
      setToolsUsed(submission.toolsUsed || "")
      setRepoLink(submission.repoLink || "")
      setDemoLink(submission.demoLink || "")
      setVideoLink(submission.videoLink || "")
      setJudgeInstructions(submission.judgeInstructions || "")
      setAdditionalInfo(submission.additionalInfo || "")
    } else {
      // Fetch the current team to ensure we have the data
      hackathonStore.fetchCurrentTeam()
    }
  }, [hackathonStore, isEdit])

  const handleNext = () => {
    if (step === 1 && (!projectName || !projectDescription)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (step === 2 && !repoLink) {
      toast({
        title: "Repository link required",
        description: "Please provide a link to your code repository.",
        variant: "destructive",
      })
      return
    }

    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    const submissionData = {
      name: projectName,
      description: projectDescription,
      toolsUsed,
      repoLink,
      demoLink,
      videoLink,
      judgeInstructions,
      additionalInfo,
      teamId: hackathonStore.currentTeam?.id,
      hackathonId: hackathonStore.currentTeam?.hackathon?.id,
      // Handle file upload separately
      presentationFile: presentationFile ? await convertFileToBase64(presentationFile) : undefined,
    }

    try {
      if (isEdit) {
        await hackathonStore.updateSubmission(hackathonStore.currentTeam?.submission?.id || "", submissionData)
      } else {
        await hackathonStore.submitProject(submissionData)
      }

      toast({
        title: isEdit ? "Project updated successfully" : "Project submitted successfully",
        description: isEdit ? "Your project has been updated." : "Your project has been submitted for judging.",
      })

      router.push(`/hackathons/teams/${hackathonStore.currentTeam?.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPresentationFile(e.target.files[0])
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={isEdit ? "Edit Project" : "Submit Project"}
        text={`${isEdit ? "Edit" : "Submit"} your team's project for the ${hackathonStore.currentTeam?.hackathon?.name || "Hackathon"}`}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Badge
                variant={step === 1 ? "default" : "outline"}
                className="h-8 w-8 rounded-full p-0 flex items-center justify-center mr-2"
              >
                1
              </Badge>
              <span className={step === 1 ? "font-medium" : "text-muted-foreground"}>Basic Information</span>
            </div>
            <Separator className="w-12 md:w-24" />
            <div className="flex items-center">
              <Badge
                variant={step === 2 ? "default" : step > 2 ? "outline" : "secondary"}
                className="h-8 w-8 rounded-full p-0 flex items-center justify-center mr-2"
              >
                2
              </Badge>
              <span
                className={step === 2 ? "font-medium" : step > 2 ? "text-muted-foreground" : "text-muted-foreground"}
              >
                Project Materials
              </span>
            </div>
            <Separator className="w-12 md:w-24" />
            <div className="flex items-center">
              <Badge
                variant={step === 3 ? "default" : step > 3 ? "outline" : "secondary"}
                className="h-8 w-8 rounded-full p-0 flex items-center justify-center mr-2"
              >
                3
              </Badge>
              <span
                className={step === 3 ? "font-medium" : step > 3 ? "text-muted-foreground" : "text-muted-foreground"}
              >
                Additional Info
              </span>
            </div>
            <Separator className="w-12 md:w-24" />
            <div className="flex items-center">
              <Badge
                variant={step === 4 ? "default" : "secondary"}
                className="h-8 w-8 rounded-full p-0 flex items-center justify-center mr-2"
              >
                4
              </Badge>
              <span className={step === 4 ? "font-medium" : "text-muted-foreground"}>Confirmation</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide essential details about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="project-name"
                  placeholder="Enter your project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">
                  Project Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="project-description"
                  placeholder="Describe what your project does and the problem it solves"
                  rows={5}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tools-used">Tools and Frameworks Used</Label>
                <Textarea
                  id="tools-used"
                  placeholder="List the technologies, frameworks, and tools used in your project"
                  rows={3}
                  value={toolsUsed}
                  onChange={(e) => setToolsUsed(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/hackathons/teams/${hackathonStore.currentTeam?.id || "1"}`}>
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Team
                </Button>
              </Link>
              <Button onClick={handleNext}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Materials</CardTitle>
              <CardDescription>Upload or link to your project materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repo-link" className="flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  Code Repository Link <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="repo-link"
                  placeholder="https://github.com/yourusername/your-repo"
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Link to your GitHub, GitLab, or other code repository</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-link" className="flex items-center">
                  <Link2 className="mr-2 h-4 w-4" />
                  Live Demo Link
                </Label>
                <Input
                  id="demo-link"
                  placeholder="https://your-demo-site.com"
                  value={demoLink}
                  onChange={(e) => setDemoLink(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Link to a live demo of your project (if available)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-link" className="flex items-center">
                  <Video className="mr-2 h-4 w-4" />
                  Video Presentation Link
                </Label>
                <Input
                  id="video-link"
                  placeholder="https://youtube.com/your-video"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Link to a video demonstration or presentation of your project
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="presentation-file" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Presentation Document
                </Label>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="presentation-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PDF, PPT, or PPTX (max. 10MB)</p>
                      </div>
                      <input
                        id="presentation-file"
                        type="file"
                        className="hidden"
                        accept=".pdf,.ppt,.pptx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {presentationFile && (
                    <div className="mt-2 flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm truncate max-w-[200px]">{presentationFile.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setPresentationFile(null)}>
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Step
              </Button>
              <Button onClick={handleNext}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Provide any special instructions or additional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judge-instructions">Instructions for Judges</Label>
                <Textarea
                  id="judge-instructions"
                  placeholder="Any specific instructions for judges when reviewing your project"
                  rows={4}
                  value={judgeInstructions}
                  onChange={(e) => setJudgeInstructions(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-info">Additional Information</Label>
                <Textarea
                  id="additional-info"
                  placeholder="Any other relevant details about your project"
                  rows={4}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Step
              </Button>
              <Button onClick={handleNext}>
                Review Submission
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>Review your project details before final submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                <div className="space-y-2 pl-4">
                  <div>
                    <span className="font-medium">Project Name:</span> {projectName}
                  </div>
                  <div>
                    <span className="font-medium">Project Description:</span>
                    <p className="mt-1 text-sm text-muted-foreground">{projectDescription}</p>
                  </div>
                  <div>
                    <span className="font-medium">Tools and Frameworks:</span>
                    <p className="mt-1 text-sm text-muted-foreground">{toolsUsed || "None specified"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Project Materials</h3>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    <span className="font-medium">Repository Link:</span>
                    <a
                      href={repoLink}
                      className="ml-2 text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repoLink}
                    </a>
                  </div>
                  {demoLink && (
                    <div className="flex items-center">
                      <Link2 className="h-4 w-4 mr-2" />
                      <span className="font-medium">Demo Link:</span>
                      <a
                        href={demoLink}
                        className="ml-2 text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {demoLink}
                      </a>
                    </div>
                  )}
                  {videoLink && (
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      <span className="font-medium">Video Link:</span>
                      <a
                        href={videoLink}
                        className="ml-2 text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {videoLink}
                      </a>
                    </div>
                  )}
                  {presentationFile && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="font-medium">Presentation:</span>
                      <span className="ml-2">{presentationFile.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                <div className="space-y-2 pl-4">
                  <div>
                    <span className="font-medium">Instructions for Judges:</span>
                    <p className="mt-1 text-sm text-muted-foreground">{judgeInstructions || "None provided"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Additional Information:</span>
                    <p className="mt-1 text-sm text-muted-foreground">{additionalInfo || "None provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <p className="font-medium">Submission Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      By submitting this project, you confirm that all materials are original work created by your team
                      during the hackathon period, and you agree to the hackathon's terms and conditions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Make Changes
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Submitting..." : isEdit ? "Update Project" : "Submit Project"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
})

export default SubmitProjectPage
