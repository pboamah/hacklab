"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Flag,
  MessageSquare,
  MoreHorizontal,
  Search,
  Trash2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminLayout } from "@/components/admin-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminModerationPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedReport, setExpandedReport] = useState<string | null>(null)

  const toggleReport = (id: string) => {
    if (expandedReport === id) {
      setExpandedReport(null)
    } else {
      setExpandedReport(id)
    }
  }

  const handleApproveContent = (id: string) => {
    toast({
      title: "Content approved",
      description: "The reported content has been approved and will remain visible.",
    })
  }

  const handleRemoveContent = (id: string) => {
    toast({
      title: "Content removed",
      description: "The reported content has been removed from the platform.",
    })
  }

  const handleWarnUser = (id: string) => {
    toast({
      title: "User warned",
      description: "A warning has been sent to the user regarding their content.",
    })
  }

  const filteredReports = reports.filter(
    (report) =>
      report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.contentType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AdminLayout>
      <DashboardHeader heading="Content Moderation" text="Review and manage reported content">
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Approve All
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">
            <Flag className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="automod">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Auto-Moderation
          </TabsTrigger>
          <TabsTrigger value="banned">
            <X className="mr-2 h-4 w-4" />
            Banned Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Reported Content</CardTitle>
                  <CardDescription>Review content that has been flagged by users</CardDescription>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      className="pl-10 w-full md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="post">Posts</SelectItem>
                      <SelectItem value="comment">Comments</SelectItem>
                      <SelectItem value="user">Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <Collapsible
                    key={report.id}
                    open={expandedReport === report.id}
                    onOpenChange={() => toggleReport(report.id)}
                    className="border rounded-md"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-full p-2 ${
                            report.severity === "high"
                              ? "bg-red-100 text-red-800"
                              : report.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <Flag className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{report.reason}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.contentType} • Reported by {report.reportedBy}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            report.status === "pending"
                              ? "outline"
                              : report.status === "reviewing"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {report.status}
                        </Badge>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {expandedReport === report.id ? (
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
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Reported Content</h3>
                          <div className="border rounded-md p-3 bg-muted/30">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={report.contentAuthorAvatar} alt={report.contentAuthor} />
                                <AvatarFallback>{report.contentAuthor.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{report.contentAuthor}</span>
                            </div>
                            <p className="text-sm">{report.content}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Report Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">Reported by:</span> {report.reportedBy}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Date:</span> {report.date}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Severity:</span>{" "}
                                <Badge
                                  variant="outline"
                                  className={
                                    report.severity === "high"
                                      ? "bg-red-100 text-red-800"
                                      : report.severity === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {report.severity}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">Content type:</span> {report.contentType}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Content author:</span> {report.contentAuthor}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Previous reports:</span>{" "}
                                {report.previousReports ? report.previousReports : "None"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {report.reporterComment && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Reporter Comment</h3>
                            <div className="border rounded-md p-3 bg-muted/30">
                              <p className="text-sm">{report.reporterComment}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleApproveContent(report.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              Approve Content
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-500"
                              onClick={() => handleRemoveContent(report.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Content
                            </Button>
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
                              <DropdownMenuItem onClick={() => handleWarnUser(report.id)}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Warn User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                <X className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}

                {filteredReports.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No reports found</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredReports.length} of {reports.length} reports
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
        </TabsContent>

        <TabsContent value="automod" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Moderation Settings</CardTitle>
              <CardDescription>Configure automated content moderation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Profanity Filter</h3>
                      <p className="text-sm text-muted-foreground">
                        Automatically filter out profanity and offensive language
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Select defaultValue="moderate">
                        <SelectTrigger className="w-[120px]">
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
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Currently blocking <span className="font-medium">247</span> words and phrases
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Spam Detection</h3>
                      <p className="text-sm text-muted-foreground">Identify and remove spam content automatically</p>
                    </div>
                    <div className="flex items-center">
                      <Select defaultValue="enabled">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">35</span> spam messages blocked in the last 7 days
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Content Toxicity</h3>
                      <p className="text-sm text-muted-foreground">
                        Detect and flag potentially toxic or harmful content
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Select defaultValue="flag">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="block">Block</SelectItem>
                          <SelectItem value="flag">Flag</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">12</span> posts flagged for toxicity in the last 7 days
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Link Scanning</h3>
                      <p className="text-sm text-muted-foreground">
                        Scan external links for malicious content or phishing
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Select defaultValue="enabled">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">8</span> malicious links blocked in the last 7 days
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="banned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Banned Content</CardTitle>
              <CardDescription>Review content that has been removed from the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bannedContent.map((item) => (
                  <div key={item.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.authorAvatar} alt={item.author} />
                          <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{item.author}</div>
                          <div className="text-xs text-muted-foreground">{item.date}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="border rounded-md p-3 bg-muted/30 my-2">
                      <p className="text-sm">{item.content}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Reason:</span> {item.reason}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Check className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}

// Sample data
const reports = [
  {
    id: "1",
    reason: "Inappropriate content",
    contentType: "Post",
    reportedBy: "Jane Smith",
    date: "April 10, 2025",
    severity: "high",
    status: "pending",
    content:
      "This is the reported content that contains inappropriate language or material that violates community guidelines.",
    contentAuthor: "Michael Johnson",
    contentAuthorAvatar: "/placeholder.svg?height=32&width=32&text=MJ",
    previousReports: "2 previous reports",
    reporterComment: "This post contains offensive language and should be removed.",
  },
  {
    id: "2",
    reason: "Spam",
    contentType: "Comment",
    reportedBy: "David Brown",
    date: "April 9, 2025",
    severity: "medium",
    status: "reviewing",
    content: "Check out this amazing offer! Click here to get 50% off on all products. Limited time offer!",
    contentAuthor: "Sarah Williams",
    contentAuthorAvatar: "/placeholder.svg?height=32&width=32&text=SW",
    previousReports: "1 previous report",
    reporterComment: null,
  },
  {
    id: "3",
    reason: "Harassment",
    contentType: "Post",
    reportedBy: "Robert Wilson",
    date: "April 8, 2025",
    severity: "high",
    status: "pending",
    content: "This user has been repeatedly targeting me with negative comments and personal attacks.",
    contentAuthor: "Emily Davis",
    contentAuthorAvatar: "/placeholder.svg?height=32&width=32&text=ED",
    previousReports: null,
    reporterComment: "This user has been harassing me for weeks. Please take action.",
  },
  {
    id: "4",
    reason: "Misinformation",
    contentType: "Post",
    reportedBy: "Lisa Taylor",
    date: "April 7, 2025",
    severity: "medium",
    status: "resolved",
    content:
      "Breaking news: The government has announced that all citizens will receive $10,000 as part of a new economic stimulus package.",
    contentAuthor: "John Doe",
    contentAuthorAvatar: "/placeholder.svg?height=32&width=32&text=JD",
    previousReports: null,
    reporterComment: "This information is false and misleading.",
  },
  {
    id: "5",
    reason: "Copyright violation",
    contentType: "Comment",
    reportedBy: "Michael Johnson",
    date: "April 6, 2025",
    severity: "low",
    status: "pending",
    content: "Here's the full text of the book that was just published. Enjoy!",
    contentAuthor: "David Brown",
    contentAuthorAvatar: "/placeholder.svg?height=32&width=32&text=DB",
    previousReports: null,
    reporterComment: "This user is sharing copyrighted material without permission.",
  },
]

const bannedContent = [
  {
    id: "1",
    author: "Michael Johnson",
    authorAvatar: "/placeholder.svg?height=32&width=32&text=MJ",
    date: "April 5, 2025",
    type: "Post",
    content: "This content was removed for violating community guidelines on hate speech.",
    reason: "Hate speech",
  },
  {
    id: "2",
    author: "Sarah Williams",
    authorAvatar: "/placeholder.svg?height=32&width=32&text=SW",
    date: "April 3, 2025",
    type: "Comment",
    content: "This content was removed for violating community guidelines on spam.",
    reason: "Spam",
  },
  {
    id: "3",
    author: "David Brown",
    authorAvatar: "/placeholder.svg?height=32&width=32&text=DB",
    date: "April 1, 2025",
    type: "Post",
    content: "This content was removed for violating community guidelines on harassment.",
    reason: "Harassment",
  },
]
