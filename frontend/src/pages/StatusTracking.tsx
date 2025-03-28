"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Calendar, Clock, FileText, Bell, AlertCircle, CheckCircle, Search, ArrowRight } from "lucide-react"
import DashboardLayout from "../components/layout/DashboardLayout"

interface CaseStatus {
  id: string
  caseNumber: string
  court: string
  applicant: string
  filingDate: string
  nextHearing: string
  status: "Pending" | "Approved" | "Rejected" | "Scheduled"
  judge: string
  updates: {
    date: string
    time: string
    description: string
  }[]
}

export default function StatusTracking() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCase, setSelectedCase] = useState<CaseStatus | null>(null)

  // Sample case statuses
  const caseStatuses: CaseStatus[] = [
    {
      id: "case-1",
      caseNumber: "BA-123/2023",
      court: "Sessions Court, Delhi",
      applicant: "Rahul Kumar",
      filingDate: "2023-03-15",
      nextHearing: "2023-04-05",
      status: "Pending",
      judge: "Hon'ble Judge Sharma",
      updates: [
        {
          date: "2023-03-15",
          time: "10:30 AM",
          description: "Bail application filed",
        },
        {
          date: "2023-03-20",
          time: "11:45 AM",
          description: "Application listed for hearing on 05/04/2023",
        },
        {
          date: "2023-03-25",
          time: "02:30 PM",
          description: "Prosecution requested time to file reply",
        },
      ],
    },
    {
      id: "case-2",
      caseNumber: "BA-145/2023",
      court: "High Court, Mumbai",
      applicant: "Priya Sharma",
      filingDate: "2023-03-10",
      nextHearing: "2023-03-28",
      status: "Scheduled",
      judge: "Hon'ble Justice Patel",
      updates: [
        {
          date: "2023-03-10",
          time: "09:15 AM",
          description: "Bail application filed",
        },
        {
          date: "2023-03-18",
          time: "10:00 AM",
          description: "Prosecution filed reply opposing bail",
        },
        {
          date: "2023-03-22",
          time: "03:15 PM",
          description: "Arguments partially heard, matter adjourned to 28/03/2023",
        },
      ],
    },
    {
      id: "case-3",
      caseNumber: "BA-098/2023",
      court: "Sessions Court, Bangalore",
      applicant: "Sunil Verma",
      filingDate: "2023-02-28",
      nextHearing: "2023-04-02",
      status: "Approved",
      judge: "Hon'ble Judge Rao",
      updates: [
        {
          date: "2023-02-28",
          time: "11:30 AM",
          description: "Bail application filed",
        },
        {
          date: "2023-03-10",
          time: "02:00 PM",
          description: "Prosecution filed reply",
        },
        {
          date: "2023-03-15",
          time: "11:00 AM",
          description: "Arguments heard",
        },
        {
          date: "2023-03-20",
          time: "10:30 AM",
          description: "Bail granted with conditions",
        },
      ],
    },
    {
      id: "case-4",
      caseNumber: "BA-112/2023",
      court: "Sessions Court, Delhi",
      applicant: "Vikram Patel",
      filingDate: "2023-03-05",
      nextHearing: "",
      status: "Rejected",
      judge: "Hon'ble Judge Kumar",
      updates: [
        {
          date: "2023-03-05",
          time: "09:45 AM",
          description: "Bail application filed",
        },
        {
          date: "2023-03-12",
          time: "10:15 AM",
          description: "Prosecution filed strong opposition",
        },
        {
          date: "2023-03-18",
          time: "11:30 AM",
          description: "Arguments heard",
        },
        {
          date: "2023-03-22",
          time: "02:45 PM",
          description: "Bail application rejected",
        },
      ],
    },
  ]

  const filteredCases = caseStatuses.filter(
    (caseStatus) =>
      caseStatus.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseStatus.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseStatus.court.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: CaseStatus["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      case "Pending":
        return "bg-yellow-500"
      case "Scheduled":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: CaseStatus["status"]) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Scheduled":
        return <Calendar className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bail Status Tracking</h1>
          <p className="text-muted-foreground">Monitor the progress of bail applications and upcoming court dates</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by case number, applicant name, or court..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Bail Applications</CardTitle>
                <CardDescription>Track status and updates</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredCases.length > 0 ? (
                    filteredCases.map((caseStatus) => (
                      <div
                        key={caseStatus.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedCase?.id === caseStatus.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedCase(caseStatus)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm font-medium">{caseStatus.caseNumber}</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(caseStatus.status)} mr-2`}></div>
                            <span className="text-xs">{caseStatus.status}</span>
                          </div>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm">{caseStatus.applicant}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{caseStatus.court}</span>
                          <span>Filed: {new Date(caseStatus.filingDate).toLocaleDateString()}</span>
                        </div>
                        {caseStatus.nextHearing && (
                          <div className="mt-2 flex items-center text-xs">
                            <Calendar className="h-3 w-3 text-primary mr-1" />
                            <span className="text-primary">
                              Next hearing: {new Date(caseStatus.nextHearing).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No cases found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Add New Application
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Case Details */}
          <div className="lg:col-span-2">
            {selectedCase ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{selectedCase.caseNumber}</CardTitle>
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            selectedCase.status === "Approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : selectedCase.status === "Rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : selectedCase.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          }`}
                        >
                          {selectedCase.status}
                        </div>
                      </div>
                      <CardDescription>{selectedCase.court}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Bell className="mr-2 h-4 w-4" />
                        Set Alert
                      </Button>
                      <Button size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Application
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Applicant</Label>
                      <p className="font-medium">{selectedCase.applicant}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Filing Date</Label>
                      <p className="font-medium">{new Date(selectedCase.filingDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Judge</Label>
                      <p className="font-medium">{selectedCase.judge}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Next Hearing</Label>
                      <p className="font-medium">
                        {selectedCase.nextHearing
                          ? new Date(selectedCase.nextHearing).toLocaleDateString()
                          : "Not scheduled"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Status Timeline</Label>
                    <div className="relative pl-6 border-l border-muted space-y-4">
                      {selectedCase.updates.map((update, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-background"></div>
                          </div>
                          <div className="mb-1">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                              <span className="font-medium">{new Date(update.date).toLocaleDateString()}</span>
                              <Clock className="h-3 w-3 text-muted-foreground ml-2 mr-1" />
                              <span>{update.time}</span>
                            </div>
                          </div>
                          <p className="text-sm">{update.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedCase.status === "Approved" && (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-md">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                        <div>
                          <h5 className="text-sm font-medium text-green-800 dark:text-green-300">Bail Approved</h5>
                          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                            Bail has been granted with conditions. Please ensure compliance with all conditions to avoid
                            revocation.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedCase.status === "Rejected" && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                        <div>
                          <h5 className="text-sm font-medium text-red-800 dark:text-red-300">Bail Rejected</h5>
                          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                            Bail application has been rejected. You may file a fresh application or appeal to a higher
                            court.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t flex justify-between">
                  <Button variant="outline">
                    <Bell className="mr-2 h-4 w-4" />
                    Set Hearing Reminder
                  </Button>
                  <Button>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Take Action
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="pt-10 pb-10 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Case</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Choose a case from the list on the left to view detailed status information and updates.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Upcoming Hearings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Hearings</CardTitle>
            <CardDescription>Schedule of upcoming court hearings for your bail applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calendar">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              <TabsContent value="calendar" className="p-4 border rounded-md mt-4">
                <div className="text-center p-8">
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                  <p className="text-sm text-muted-foreground mb-4">Calendar integration would be displayed here</p>
                </div>
              </TabsContent>
              <TabsContent value="list" className="p-4 border rounded-md mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="min-w-[48px] rounded-md bg-primary/10 p-2 text-center">
                      <p className="text-xs font-medium">MAR</p>
                      <p className="text-lg font-bold">28</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">State vs. Priya Sharma</p>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">11:00 AM</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">High Court, Mumbai • BA-145/2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="min-w-[48px] rounded-md bg-primary/10 p-2 text-center">
                      <p className="text-xs font-medium">APR</p>
                      <p className="text-lg font-bold">02</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">State vs. Sunil Verma</p>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">2:00 PM</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Sessions Court, Bangalore • BA-098/2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="min-w-[48px] rounded-md bg-primary/10 p-2 text-center">
                      <p className="text-xs font-medium">APR</p>
                      <p className="text-lg font-bold">05</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">State vs. Rahul Kumar</p>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">10:30 AM</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Sessions Court, Delhi • BA-123/2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

