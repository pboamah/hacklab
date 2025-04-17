"use client"

import { useState } from "react"
import { BarChart3, Calendar, Download, FileText, LineChart, PieChart, RefreshCcw, Users, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function AdminReportsPage() {
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("month")
  const [reportType, setReportType] = useState("participation")

  const handleExportReport = () => {
    toast({
      title: "Report exported",
      description: "The report has been exported successfully.",
    })
  }

  const handleRefreshData = () => {
    toast({
      title: "Data refreshed",
      description: "Report data has been refreshed with the latest information.",
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Reports & Analytics" text="Comprehensive platform analytics and reporting">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </DashboardHeader>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="participation">Participation Report</SelectItem>
            <SelectItem value="hackathons">Hackathon Performance</SelectItem>
            <SelectItem value="users">User Activity</SelectItem>
            <SelectItem value="submissions">Submission Analysis</SelectItem>
            <SelectItem value="judging">Judging Report</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="quarter">Last 90 days</SelectItem>
            <SelectItem value="year">Last 12 months</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="tables">Data Tables</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,853</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-green-500 mr-1">+12%</span>
                  <span className="text-xs text-muted-foreground">from previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hackathons</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">16</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-green-500 mr-1">+3</span>
                  <span className="text-xs text-muted-foreground">from previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teams</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-green-500 mr-1">+24%</span>
                  <span className="text-xs text-muted-foreground">from previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-green-500 mr-1">+18%</span>
                  <span className="text-xs text-muted-foreground">from previous period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Participation Trends</CardTitle>
                <CardDescription>User registration and engagement over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <div className="text-center">
                  <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Participation trend chart would appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Distribution</CardTitle>
                <CardDescription>Breakdown of submissions by hackathon</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <div className="text-center">
                  <PieChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Submission distribution chart would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hackathon Performance</CardTitle>
              <CardDescription>Comparison of participation and completion rates</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted rounded-md">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Hackathon performance chart would appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Important metrics and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">User Engagement</h3>
                <p className="text-sm text-muted-foreground">
                  User engagement has increased by 18% compared to the previous period, with the highest activity in the
                  AI Solutions Hackathon.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Submission Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Average submission scores have improved by 0.5 points (on a 5-point scale) compared to previous
                  hackathons, indicating higher quality projects.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Team Formation</h3>
                <p className="text-sm text-muted-foreground">
                  Teams are forming earlier in the hackathon cycle, with 65% of teams created within the first week of
                  registration opening.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Judging Efficiency</h3>
                <p className="text-sm text-muted-foreground">
                  Judges are completing evaluations 25% faster than in previous hackathons, with more detailed feedback
                  being provided.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <div className="text-center">
                  <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">User growth chart would appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
                <CardDescription>Distribution of user roles on the platform</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <div className="text-center">
                  <PieChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">User roles chart would appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hackathon Participation</CardTitle>
                <CardDescription>Registration and submission rates by hackathon</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Hackathon participation chart would appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Scores</CardTitle>
                <CardDescription>Average scores by judging criteria</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Submission scores chart would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hackathon Performance Data</CardTitle>
              <CardDescription>Detailed metrics for all hackathons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Hackathon</th>
                      <th className="h-10 px-4 text-left font-medium">Participants</th>
                      <th className="h-10 px-4 text-left font-medium">Teams</th>
                      <th className="h-10 px-4 text-left font-medium">Submissions</th>
                      <th className="h-10 px-4 text-left font-medium">Avg. Score</th>
                      <th className="h-10 px-4 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hackathonData.map((hackathon, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">{hackathon.name}</td>
                        <td className="p-4">{hackathon.participants}</td>
                        <td className="p-4">{hackathon.teams}</td>
                        <td className="p-4">{hackathon.submissions}</td>
                        <td className="p-4">{hackathon.avgScore}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              hackathon.status === "Completed"
                                ? "secondary"
                                : hackathon.status === "Active"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {hackathon.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Activity Summary</CardTitle>
              <CardDescription>Activity metrics by user role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Role</th>
                      <th className="h-10 px-4 text-left font-medium">Users</th>
                      <th className="h-10 px-4 text-left font-medium">Active Users</th>
                      <th className="h-10 px-4 text-left font-medium">Avg. Sessions</th>
                      <th className="h-10 px-4 text-left font-medium">Retention Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActivityData.map((role, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">{role.role}</td>
                        <td className="p-4">{role.users}</td>
                        <td className="p-4">{role.activeUsers}</td>
                        <td className="p-4">{role.avgSessions}</td>
                        <td className="p-4">{role.retentionRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Download reports in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Participation Report</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Detailed report on user participation, team formation, and submission rates.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Hackathon Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Metrics on hackathon engagement, completion rates, and judging results.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">User Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Detailed user activity, engagement metrics, and retention analysis.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Judging Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Comprehensive analysis of judging scores, feedback, and evaluation patterns.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Set up automated report delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Report Name</th>
                      <th className="h-10 px-4 text-left font-medium">Frequency</th>
                      <th className="h-10 px-4 text-left font-medium">Recipients</th>
                      <th className="h-10 px-4 text-left font-medium">Format</th>
                      <th className="h-10 px-4 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">Weekly Activity Summary</td>
                      <td className="p-4">Weekly</td>
                      <td className="p-4">Admin Team</td>
                      <td className="p-4">PDF</td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Monthly Performance Report</td>
                      <td className="p-4">Monthly</td>
                      <td className="p-4">Management</td>
                      <td className="p-4">PDF, CSV</td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Hackathon Completion Report</td>
                      <td className="p-4">After each hackathon</td>
                      <td className="p-4">Organizers</td>
                      <td className="p-4">PDF</td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Scheduled Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

// Sample data
const hackathonData = [
  {
    name: "AI Solutions Hackathon",
    participants: 120,
    teams: 24,
    submissions: 20,
    avgScore: 4.2,
    status: "Upcoming",
  },
  {
    name: "FinTech Innovation Challenge",
    participants: 85,
    teams: 17,
    submissions: 15,
    avgScore: 3.9,
    status: "Upcoming",
  },
  {
    name: "Mobile Health Solutions",
    participants: 95,
    teams: 19,
    submissions: 18,
    avgScore: 4.1,
    status: "Active",
  },
  {
    name: "EdTech Innovation Challenge",
    participants: 75,
    teams: 15,
    submissions: 12,
    avgScore: 4.3,
    status: "Completed",
  },
  {
    name: "Blockchain for Social Good",
    participants: 65,
    teams: 13,
    submissions: 11,
    avgScore: 3.8,
    status: "Completed",
  },
]

const userActivityData = [
  {
    role: "Participants",
    users: 1942,
    activeUsers: 1456,
    avgSessions: 8.3,
    retentionRate: "75%",
  },
  {
    role: "Team Leaders",
    users: 342,
    activeUsers: 298,
    avgSessions: 12.5,
    retentionRate: "87%",
  },
  {
    role: "Judges",
    users: 228,
    activeUsers: 195,
    avgSessions: 6.2,
    retentionRate: "85%",
  },
  {
    role: "Mentors",
    users: 199,
    activeUsers: 172,
    avgSessions: 7.8,
    retentionRate: "86%",
  },
  {
    role: "Organizers",
    users: 85,
    activeUsers: 78,
    avgSessions: 15.3,
    retentionRate: "92%",
  },
  {
    role: "Admins",
    users: 57,
    activeUsers: 54,
    avgSessions: 22.7,
    retentionRate: "95%",
  },
]
