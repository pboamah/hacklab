import Link from "next/link"
import { Calendar, Download, Medal, Search, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function HackathonResultsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Hackathon Results" text="View winners and all submissions from past hackathons">
        <Button variant="outline" asChild>
          <Link href="/hackathons">View Upcoming Hackathons</Link>
        </Button>
      </DashboardHeader>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-10" />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2">
          <option value="">All Hackathons</option>
          <option value="ai-solutions">AI Solutions Hackathon</option>
          <option value="fintech">FinTech Innovation Challenge</option>
          <option value="edtech">EdTech Innovation Challenge</option>
        </select>
      </div>

      <Tabs defaultValue="winners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="winners">
            <Trophy className="mr-2 h-4 w-4" />
            Winners
          </TabsTrigger>
          <TabsTrigger value="all-projects">
            <Medal className="mr-2 h-4 w-4" />
            All Projects
          </TabsTrigger>
          <TabsTrigger value="my-achievements">
            <Trophy className="mr-2 h-4 w-4" />
            My Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="winners" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>EdTech Innovation Challenge</CardTitle>
                  <CardDescription>January 15-17, 2025</CardDescription>
                </div>
                <Badge className="bg-yellow-500">Completed</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2 border-yellow-500">
                  <CardHeader className="pb-2 text-center">
                    <div className="mx-auto mb-2">
                      <Trophy className="h-10 w-10 text-yellow-500" />
                    </div>
                    <CardTitle>First Place</CardTitle>
                    <CardDescription>$2,500 Prize</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center mb-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" alt="LearnSmart" />
                        <AvatarFallback>LS</AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="text-lg font-bold">LearnSmart</h3>
                    <p className="text-sm text-muted-foreground">By Education Innovators</p>
                    <p className="mt-2 text-sm">AI-powered personalized learning platform for K-12 students</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/hackathons/projects/10" className="w-full">
                      <Button variant="outline" className="w-full">
                        View Project
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card className="border-2 border-gray-400">
                  <CardHeader className="pb-2 text-center">
                    <div className="mx-auto mb-2">
                      <Trophy className="h-10 w-10 text-gray-400" />
                    </div>
                    <CardTitle>Second Place</CardTitle>
                    <CardDescription>$1,500 Prize</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center mb-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" alt="ClassConnect" />
                        <AvatarFallback>CC</AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="text-lg font-bold">ClassConnect</h3>
                    <p className="text-sm text-muted-foreground">By Tech Educators</p>
                    <p className="mt-2 text-sm">Virtual classroom platform with interactive learning tools</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/hackathons/projects/11" className="w-full">
                      <Button variant="outline" className="w-full">
                        View Project
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card className="border-2 border-amber-600">
                  <CardHeader className="pb-2 text-center">
                    <div className="mx-auto mb-2">
                      <Trophy className="h-10 w-10 text-amber-600" />
                    </div>
                    <CardTitle>Third Place</CardTitle>
                    <CardDescription>$1,000 Prize</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center mb-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" alt="EduAssess" />
                        <AvatarFallback>EA</AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="text-lg font-bold">EduAssess</h3>
                    <p className="text-sm text-muted-foreground">By Assessment Pros</p>
                    <p className="mt-2 text-sm">Automated assessment and feedback system for educators</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/hackathons/projects/12" className="w-full">
                      <Button variant="outline" className="w-full">
                        View Project
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Category Winners</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Trophy className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Best UX Design</div>
                      <div className="text-sm text-muted-foreground">ClassConnect by Tech Educators</div>
                      <Link href="/hackathons/projects/11" className="text-sm text-primary hover:underline">
                        View Project
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Trophy className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Most Innovative</div>
                      <div className="text-sm text-muted-foreground">LearnSmart by Education Innovators</div>
                      <Link href="/hackathons/projects/10" className="text-sm text-primary hover:underline">
                        View Project
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="rounded-full bg-green-100 p-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Best Technical Implementation</div>
                      <div className="text-sm text-muted-foreground">EduAssess by Assessment Pros</div>
                      <Link href="/hackathons/projects/12" className="text-sm text-primary hover:underline">
                        View Project
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="rounded-full bg-red-100 p-2">
                      <Trophy className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">People's Choice</div>
                      <div className="text-sm text-muted-foreground">LearnSmart by Education Innovators</div>
                      <Link href="/hackathons/projects/10" className="text-sm text-primary hover:underline">
                        View Project
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/hackathons/edtech-innovation-challenge">View Hackathon Details</Link>
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Results
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Blockchain for Social Good</CardTitle>
                  <CardDescription>February 8-10, 2025</CardDescription>
                </div>
                <Badge className="bg-yellow-500">Completed</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2 border-yellow-500">
                  <CardHeader className="pb-2 text-center">
                    <div className="mx-auto mb-2">
                      <Trophy className="h-10 w-10 text-yellow-500" />
                    </div>
                    <CardTitle>First Place</CardTitle>
                    <CardDescription>$2,000 Prize</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center mb-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" alt="CryptoAid" />
                        <AvatarFallback>CA</AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="text-lg font-bold">CryptoAid</h3>
                    <p className="text-sm text-muted-foreground">By Blockchain Innovators</p>
                    <p className="mt-2 text-sm">Transparent donation tracking system for humanitarian aid</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/hackathons/projects/13" className="w-full">
                      <Button variant="outline" className="w-full">
                        View Project
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                {/* Additional winners would be listed here */}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/hackathons/blockchain-social-good">View Hackathon Details</Link>
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="all-projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.team}</CardDescription>
                    </div>
                    {project.award && <Badge className="bg-yellow-500">{project.award}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {project.hackathon}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/hackathons/projects/${project.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Project
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Hackathon Achievements</CardTitle>
              <CardDescription>Your participation and awards from past hackathons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Participation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Medal className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">EdTech Innovation Challenge</div>
                      <div className="text-sm text-muted-foreground">January 15-17, 2025</div>
                      <div className="text-sm text-muted-foreground">Team: Innovation Squad</div>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">
                          Second Place
                        </Badge>
                        <Badge variant="outline">Best UX Design</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Medal className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Blockchain for Social Good</div>
                      <div className="text-sm text-muted-foreground">February 8-10, 2025</div>
                      <div className="text-sm text-muted-foreground">Team: Chain Reaction</div>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline">Participant</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Certificates & Awards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">EdTech Innovation Challenge</CardTitle>
                      <CardDescription>Second Place Certificate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md p-4 bg-muted flex items-center justify-center h-32">
                        <div className="text-center">
                          <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Certificate Preview</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">EdTech Innovation Challenge</CardTitle>
                      <CardDescription>Best UX Design Award</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md p-4 bg-muted flex items-center justify-center h-32">
                        <div className="text-center">
                          <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Certificate Preview</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

// Sample data for all projects
const allProjects = [
  {
    id: "10",
    name: "LearnSmart",
    team: "Education Innovators",
    description:
      "AI-powered personalized learning platform for K-12 students that adapts to individual learning styles and pace.",
    hackathon: "EdTech Innovation Challenge",
    award: "First Place",
  },
  {
    id: "11",
    name: "ClassConnect",
    team: "Tech Educators",
    description:
      "Virtual classroom platform with interactive learning tools, real-time collaboration, and engagement analytics.",
    hackathon: "EdTech Innovation Challenge",
    award: "Second Place",
  },
  {
    id: "12",
    name: "EduAssess",
    team: "Assessment Pros",
    description:
      "Automated assessment and feedback system for educators that reduces grading time and provides detailed insights.",
    hackathon: "EdTech Innovation Challenge",
    award: "Third Place",
  },
  {
    id: "13",
    name: "CryptoAid",
    team: "Blockchain Innovators",
    description:
      "Transparent donation tracking system for humanitarian aid using blockchain technology to ensure funds reach intended recipients.",
    hackathon: "Blockchain for Social Good",
    award: "First Place",
  },
  {
    id: "14",
    name: "IdentityChain",
    team: "Digital ID Solutions",
    description: "Secure digital identity system for refugees and displaced persons using blockchain technology.",
    hackathon: "Blockchain for Social Good",
    award: "Second Place",
  },
  {
    id: "15",
    name: "StudyBuddy",
    team: "Learning Partners",
    description:
      "Peer-to-peer learning platform that connects students for collaborative study sessions and knowledge sharing.",
    hackathon: "EdTech Innovation Challenge",
  },
  {
    id: "16",
    name: "EcoLedger",
    team: "Green Chain",
    description: "Blockchain solution for tracking carbon credits and environmental impact of organizations.",
    hackathon: "Blockchain for Social Good",
  },
  {
    id: "17",
    name: "TeachAssist",
    team: "Educator Tools",
    description: "AI teaching assistant that helps educators create lesson plans, quizzes, and educational content.",
    hackathon: "EdTech Innovation Challenge",
  },
  {
    id: "18",
    name: "MicroGrants",
    team: "Community Builders",
    description: "Blockchain-based microfinance platform for community development projects in underserved areas.",
    hackathon: "Blockchain for Social Good",
  },
]
