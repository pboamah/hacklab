"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { Check, ChevronDown, FileCode, FileText, Github, Link2, ThumbsUp, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useHackathonStore } from "@/lib/store/root-store"

const ProjectDetailsPage = observer(({ params }: { params: { id: string } }) => {
  const { toast } = useToast()
  const hackathonStore = useHackathonStore()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    hackathonStore.fetchProjectById(params.id)
  }, [hackathonStore, params.id])

  const project = hackathonStore.currentProject

  const handleSubmitComment = () => {
    if (!comment.trim()) return

    setIsSubmitting(true)

    // Use MobX action to add comment
    hackathonStore
      .addProjectComment(params.id, comment)
      .then(() => {
        setIsSubmitting(false)
        setComment("")

        toast({
          title: "Comment posted",
          description: "Your comment has been added to the project.",
        })
      })
      .catch((error) => {
        setIsSubmitting(false)
        toast({
          title: "Error posting comment",
          description: "There was an error posting your comment. Please try again.",
          variant: "destructive",
        })
      })
  }

  if (hackathonStore.isLoading || !project) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Loading project...</h1>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  const totalScore = Object.values(project.scores || {}).reduce((sum, score) => sum + score, 0)
  const averageScore = totalScore / Object.keys(project.scores || {}).length || 0
  const scorePercentage = Math.round((averageScore / 5) * 100)

  return (
    <DashboardShell>
      <DashboardHeader
        heading={project.name}
        text={`Submitted by ${project.team?.name} for ${project.hackathon?.name}`}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={project.demoLink || "#"} target="_blank" rel="noopener noreferrer">
              View Demo
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/hackathons/teams/${project.team?.id}`}>View Team</Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Submitted on {project.submittedAt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Project Links</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">Repository:</span>
                    <a
                      href={project.repoLink}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.repoLink}
                    </a>
                  </div>
                  {project.demoLink && (
                    <div className="flex items-center">
                      <Link2 className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Demo:</span>
                      <a
                        href={project.demoLink}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.demoLink}
                      </a>
                    </div>
                  )}
                  {project.videoLink && (
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Video:</span>
                      <a
                        href={project.videoLink}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.videoLink}
                      </a>
                    </div>
                  )}
                  {project.presentationLink && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Presentation:</span>
                      <a
                        href={project.presentationLink}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Presentation
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Tools & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.toolsUsed?.split(", ").map((tool, index) => (
                    <Badge key={index} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              {(project.judgeInstructions || project.additionalInfo) && (
                <>
                  <Separator />

                  <Collapsible>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Additional Information</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {project.judgeInstructions && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Instructions for Judges</h4>
                          <p className="text-sm text-muted-foreground">{project.judgeInstructions}</p>
                        </div>
                      )}
                      {project.additionalInfo && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Additional Information</h4>
                          <p className="text-sm text-muted-foreground">{project.additionalInfo}</p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <FileCode className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Demo preview not available.
                    <a
                      href={project.demoLink}
                      className="text-primary hover:underline ml-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit demo site
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments & Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {project.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-4 border rounded-md">
                    <Avatar>
                      <AvatarImage src={comment.user?.avatar || "/placeholder.svg"} alt={comment.user?.name} />
                      <AvatarFallback>{comment.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.user?.name}</span>
                        {comment.user?.role && <Badge variant="outline">{comment.user?.role}</Badge>}
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <Textarea
                  placeholder="Add a comment or feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmitComment} disabled={!comment.trim() || isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-muted p-4">
                  <div className="text-3xl font-bold">{averageScore.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">/5</div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Overall Score</div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Innovation & Creativity</span>
                    <span className="font-medium">{project.scores?.innovation || 0}/5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${((project.scores?.innovation || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Technical Implementation</span>
                    <span className="font-medium">{project.scores?.technical || 0}/5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${((project.scores?.technical || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Impact & Practicality</span>
                    <span className="font-medium">{project.scores?.impact || 0}/5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${((project.scores?.impact || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Presentation & Documentation</span>
                    <span className="font-medium">{project.scores?.presentation || 0}/5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${((project.scores?.presentation || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="capitalize">
                    {project.status === "judging" ? (
                      <span className="flex items-center">
                        Judging in Progress
                        <span className="ml-1 h-2 w-2 rounded-full bg-yellow-500"></span>
                      </span>
                    ) : project.status === "completed" ? (
                      <span className="flex items-center">
                        Judging Complete
                        <Check className="ml-1 h-3 w-3" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Submitted
                        <Check className="ml-1 h-3 w-3" />
                      </span>
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={project.team?.name} />
                  <AvatarFallback>{project.team?.name?.charAt(0) || "T"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.team?.name}</div>
                  <Link href={`/hackathons/teams/${project.team?.id}`} className="text-sm text-primary hover:underline">
                    View Team Profile
                  </Link>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Team Members</h3>
                <div className="space-y-2">
                  {project.team?.members?.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name?.charAt(0) || "M"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link href={project.demoLink || "#"} target="_blank" rel="noopener noreferrer">
                  <Link2 className="mr-2 h-4 w-4" />
                  View Live Demo
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Code Repository
                </Link>
              </Button>
              <Button className="w-full" variant="outline" onClick={() => hackathonStore.voteForProject(project.id)}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Vote for People's Choice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
})

export default ProjectDetailsPage
