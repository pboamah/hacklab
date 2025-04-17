"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { Check, ChevronDown, ChevronUp, Github, Link2, Star, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useHackathonStore } from "@/lib/store/root-store"

const JudgeDashboardPage = observer(() => {
  const { toast } = useToast()
  const hackathonStore = useHackathonStore()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)

  useEffect(() => {
    hackathonStore.fetchSubmissionsToJudge()
  }, [hackathonStore])

  const toggleProject = (id: string) => {
    if (expandedProject === id) {
      setExpandedProject(null)
    } else {
      setExpandedProject(id)
    }
  }

  const handleSubmitScore = (id: string, scores: any, feedback: string) => {
    hackathonStore
      .submitJudging(id, scores, feedback)
      .then(() => {
        toast({
          title: "Scores submitted",
          description: `Your evaluation for project #${id} has been saved.`,
        })
      })
      .catch((error) => {
        toast({
          title: "Error submitting scores",
          description: "There was an error submitting your evaluation. Please try again.",
          variant: "destructive",
        })
      })
  }

  if (hackathonStore.isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Judge Dashboard" text="Loading submissions...">
          <Button variant="outline" asChild>
            <Link href="/hackathons/judge/schedule">View Schedule</Link>
          </Button>
        </DashboardHeader>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Judge Dashboard" text="Review and evaluate hackathon submissions">
        <Button variant="outline" asChild>
          <Link href="/hackathons/judge/schedule">View Schedule</Link>
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({hackathonStore.pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({hackathonStore.reviewedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="all">All Projects ({hackathonStore.allSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {hackathonStore.pendingSubmissions.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                expanded={expandedProject === project.id}
                onToggle={() => toggleProject(project.id)}
                onSubmitScore={(scores, feedback) => handleSubmitScore(project.id, scores, feedback)}
              />
            ))}
            {hackathonStore.pendingSubmissions.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No pending submissions to review.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {hackathonStore.reviewedSubmissions.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                expanded={expandedProject === project.id}
                onToggle={() => toggleProject(project.id)}
                onSubmitScore={(scores, feedback) => handleSubmitScore(project.id, scores, feedback)}
              />
            ))}
            {hackathonStore.reviewedSubmissions.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No reviewed submissions yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {hackathonStore.allSubmissions.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                expanded={expandedProject === project.id}
                onToggle={() => toggleProject(project.id)}
                onSubmitScore={(scores, feedback) => handleSubmitScore(project.id, scores, feedback)}
              />
            ))}
            {hackathonStore.allSubmissions.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No submissions available.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
})

interface ProjectCardProps {
  project: any
  expanded: boolean
  onToggle: () => void
  onSubmitScore: (scores: any, feedback: string) => void
}

const ProjectCard = observer(({ project, expanded, onToggle, onSubmitScore }: ProjectCardProps) => {
  const [scores, setScores] = useState(
    project.scores || {
      innovation: 0,
      technical: 0,
      impact: 0,
      presentation: 0,
    },
  )
  const [feedback, setFeedback] = useState(project.feedback || "")

  const totalScore = Object.values(scores).reduce((sum: number, score: any) => sum + score, 0)
  const maxPossibleScore = Object.keys(scores).length * 5
  const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100)

  const handleScoreChange = (category: keyof typeof scores, value: number) => {
    setScores({
      ...scores,
      [category]: value,
    })
  }

  return (
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <CardDescription>
                {project.team?.name} • Submitted {project.submittedAt}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {project.reviewed && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Reviewed
                </Badge>
              )}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex -space-x-2">
              {project.team?.members?.map((member: any, i: number) => (
                <Avatar key={i} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.name?.charAt(0) || "M"}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Badge variant="secondary" className="ml-2">
              {project.hackathon?.name || "Hackathon"}
            </Badge>
          </div>

          <CollapsibleContent>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Project Details</h3>
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
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Evaluation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Innovation & Creativity (25%)</Label>
                        <span className="text-sm">{scores.innovation}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Button
                            key={value}
                            variant={scores.innovation >= value ? "default" : "outline"}
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleScoreChange("innovation", value)}
                          >
                            <Star className="h-4 w-4" />
                            <span className="sr-only">{value} stars</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Technical Implementation (25%)</Label>
                        <span className="text-sm">{scores.technical}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Button
                            key={value}
                            variant={scores.technical >= value ? "default" : "outline"}
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleScoreChange("technical", value)}
                          >
                            <Star className="h-4 w-4" />
                            <span className="sr-only">{value} stars</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Impact & Practicality (25%)</Label>
                        <span className="text-sm">{scores.impact}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Button
                            key={value}
                            variant={scores.impact >= value ? "default" : "outline"}
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleScoreChange("impact", value)}
                          >
                            <Star className="h-4 w-4" />
                            <span className="sr-only">{value} stars</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Presentation & Documentation (25%)</Label>
                        <span className="text-sm">{scores.presentation}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Button
                            key={value}
                            variant={scores.presentation >= value ? "default" : "outline"}
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleScoreChange("presentation", value)}
                          >
                            <Star className="h-4 w-4" />
                            <span className="sr-only">{value} stars</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Total Score</Label>
                    <span className="font-medium">
                      {totalScore}/{maxPossibleScore} ({scorePercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${scorePercentage}%` }}></div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="feedback">Feedback & Comments</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Provide feedback to the team about their project"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/hackathons/projects/${project.id}`}>View Details</Link>
            </Button>
          </div>
          {expanded && (
            <Button size="sm" onClick={() => onSubmitScore(scores, feedback)}>
              Submit Evaluation
            </Button>
          )}
        </CardFooter>
      </Card>
    </Collapsible>
  )
})

export default JudgeDashboardPage
