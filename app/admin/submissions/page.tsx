"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Github,
  Link2,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
  Video,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"

export default function AdminSubmissionsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null)

  const toggleSubmission = (id: string) => {
    if (expandedSubmission === id) {
      setExpandedSubmission(null)
    } else {
      setExpandedSubmission(id)
    }
  }

  const handleDeleteSubmission = (id: string) => {
    toast({
      title: "Submission deleted",
      description: "The submission has been deleted successfully.",
    })
  }

  const handleAssignJudge = (id: string) => {
    toast({
      title: "Judge assigned",
      description: "A judge has been assigned to review this submission.",
    })
  }

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.hackathon.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardShell>
      <DashboardHeader heading="Submission Management" text="Review and manage hackathon project submissions">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/hackathons/judge/dashboard">
              <Eye className="mr-2 h-4 w-4" />
              Judge Dashboard
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Project Submissions</CardTitle>
              <CardDescription>Manage and review all hackathon submissions</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search submissions..."
                  className="pl-10 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="in-progress">In Review</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Collapsible
                key={submission.id}
                open={expandedSubmission === submission.id}
                onOpenChange={() => toggleSubmission(submission.id)}
                className="border rounded-md"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">{submission.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {submission.team} • {submission.hackathon}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        submission.status === "pending"
                          ? "outline"
                          : submission.status === "in-progress"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {submission.status === "pending"
                        ? "Pending Review"
                        : submission.status === "in-progress"
                          ? "In Review"
                          : "Reviewed"}
                    </Badge>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {expandedSubmission === submission.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                <CollapsibleContent>
                  <Separator />
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Submission Details</h3>
                        <div className="text-sm">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-medium w-24">Submitted:</span>
                            <span>{submission.submittedAt}</span>
                          </div>
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-medium w-24">Description:</span>
                            <span className="text-muted-foreground">{submission.description}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Project Links</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Github className="h-4 w-4 mr-2" />
                            <span className="font-medium mr-2">Repository:</span>
                            <a
                              href={submission.repoLink}
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {submission.repoLink}
                            </a>
                          </div>
                          {submission.demoLink && (
                            <div className="flex items-center">
                              <Link2 className="h-4 w-4 mr-2" />
                              <span className="font-medium mr-2">Demo:</span>
                              <a
                                href={submission.demoLink}
                                className="text-primary hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {submission.demoLink}
                              </a>
                            </div>
                          )}
                          {submission.videoLink && (
                            <div className="flex items-center">
                              <Video className="h-4 w-4 mr-2" />
                              <span className="font-medium mr-2">Video:</span>
                              <a
                                href={submission.videoLink}
                                className="text-primary hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {submission.videoLink}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {submission.status === "reviewed" && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Judging Results</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="border rounded-md p-2 text-center">
                            <div className="text-sm text-muted-foreground">Innovation</div>
                            <div className="flex items-center justify-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium ml-1">{submission.scores?.innovation}/5</span>
                            </div>
                          </div>
                          <div className="border rounded-md p-2 text-center">
                            <div className="text-sm text-muted-foreground">Technical</div>
                            <div className="flex items-center justify-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium ml-1">{submission.scores?.technical}/5</span>
                            </div>
                          </div>
                          <div className="border rounded-md p-2 text-center">
                            <div className="text-sm text-muted-foreground">Impact</div>
                            <div className="flex items-center justify-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium ml-1">{submission.scores?.impact}/5</span>
                            </div>
                          </div>
                          <div className="border rounded-md p-2 text-center">
                            <div className="text-sm text-muted-foreground">Presentation</div>
                            <div className="flex items-center justify-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium ml-1">{submission.scores?.presentation}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="font-medium">Feedback:</span>
                          <p className="text-muted-foreground mt-1">{submission.feedback}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hackathons/projects/${submission.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        {submission.status === "pending" && (
                          <Button size="sm" onClick={() => handleAssignJudge(submission.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            Assign Judge
                          </Button>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/hackathons/projects/${submission.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/hackathons/judge/submission/${submission.id}`}>
                              <Star className="mr-2 h-4 w-4" />
                              Review Submission
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteSubmission(submission.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Submission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No submissions found</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredSubmissions.length} of {submissions.length} submissions
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronUp className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}

// Sample data
const submissions = [
  {
    id: "1",
    name: "AI Health Assistant",
    team: "Code Wizards",
    hackathon: "Mobile Health Solutions",
    description:
      "An AI-powered health assistant that helps users track symptoms and provides preliminary diagnoses based on machine learning algorithms.",
    submittedAt: "March 15, 2025",
    status: "pending",
    repoLink: "https://github.com/codewizards/ai-health",
    demoLink: "https://ai-health-demo.vercel.app",
    videoLink: "https://youtube.com/watch?v=demo123",
  },
  {
    id: "2",
    name: "FinTrack",
    team: "Tech Innovators",
    hackathon: "FinTech Innovation Challenge",
    description:
      "A personal finance tracking application that uses AI to categorize expenses and provide financial insights and recommendations.",
    submittedAt: "May 12, 2025",
    status: "in-progress",
    repoLink: "https://github.com/techinnovators/fintrack",
    demoLink: "https://fintrack-demo.vercel.app",
    videoLink: null,
  },
  {
    id: "3",
    name: "EcoTrack",
    team: "Green Innovators",
    hackathon: "AI Solutions Hackathon",
    description:
      "A platform that uses AI to track and analyze environmental data, helping communities monitor pollution levels and take action.",
    submittedAt: "April 16, 2025",
    status: "in-progress",
    repoLink: "https://github.com/greeninnovators/ecotrack",
    demoLink: "https://ecotrack-demo.vercel.app",
    videoLink: "https://youtube.com/watch?v=eco123",
  },
  {
    id: "4",
    name: "LearnSmart",
    team: "Education Innovators",
    hackathon: "EdTech Innovation Challenge",
    description:
      "AI-powered personalized learning platform for K-12 students that adapts to individual learning styles and pace.",
    submittedAt: "January 17, 2025",
    status: "reviewed",
    repoLink: "https://github.com/eduinnovators/learnsmart",
    demoLink: "https://learnsmart-demo.vercel.app",
    videoLink: "https://youtube.com/watch?v=learn123",
    scores: {
      innovation: 5,
      technical: 4,
      impact: 5,
      presentation: 4,
    },
    feedback:
      "Excellent project with a strong focus on personalized learning. The AI implementation is impressive and the user interface is intuitive. Consider adding more features for different learning styles.",
  },
  {
    id: "5",
    name: "ClassConnect",
    team: "Tech Educators",
    hackathon: "EdTech Innovation Challenge",
    description:
      "Virtual classroom platform with interactive learning tools, real-time collaboration, and engagement analytics.",
    submittedAt: "January 17, 2025",
    status: "reviewed",
    repoLink: "https://github.com/techeducators/classconnect",
    demoLink: "https://classconnect-demo.vercel.app",
    videoLink: "https://youtube.com/watch?v=class123",
    scores: {
      innovation: 4,
      technical: 4,
      impact: 4,
      presentation: 4,
    },
    feedback:
      "Well-executed virtual classroom platform with good technical implementation. The collaborative features are particularly strong. Could benefit from more accessibility features.",
  },
  {
    id: "6",
    name: "MediScan",
    team: "Health Innovators",
    hackathon: "Mobile Health Solutions",
    description: "Mobile application for scanning and analyzing medical images to assist in preliminary diagnoses.",
    submittedAt: "March 14, 2025",
    status: "reviewed",
    repoLink: "https://github.com/healthinnovators/mediscan",
    demoLink: "https://mediscan-demo.vercel.app",
    videoLink: "https://youtube.com/watch?v=medi123",
    scores: {
      innovation: 4,
      technical: 4,
      impact: 4,
      presentation: 3,
    },
    feedback:
      "Innovative approach to medical image analysis with good technical implementation. The potential impact in healthcare is significant. The presentation could be more polished and documentation more comprehensive.",
  },
]
