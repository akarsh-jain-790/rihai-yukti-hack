"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { FileText, Upload, Download, Eye, Search, Calendar, Clock, User, MapPin, AlertCircle } from "lucide-react"
import DashboardLayout from "../components/layout/DashboardLayout"

interface CaseDiaryEntry {
  id: string
  date: string
  time: string
  officer: string
  location: string
  description: string
  attachments: string[]
}

export default function CaseDiary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEntry, setSelectedEntry] = useState<CaseDiaryEntry | null>(null)

  // Sample case diary entries
  const caseDiaryEntries: CaseDiaryEntry[] = [
    {
      id: "entry-1",
      date: "2023-03-15",
      time: "10:30 AM",
      officer: "Inspector Sharma",
      location: "Connaught Place Police Station",
      description:
        "Accused was brought to the police station after arrest. Initial questioning was conducted. Accused denied all allegations and claimed to be at home during the time of the incident. No witnesses have confirmed this alibi yet.",
      attachments: ["Arrest Memo", "Medical Examination Report"],
    },
    {
      id: "entry-2",
      date: "2023-03-16",
      time: "02:15 PM",
      officer: "SI Verma",
      location: "Crime Scene, Sector 18",
      description:
        "Crime scene investigation conducted. Collected fingerprints, blood samples, and other physical evidence. The scene showed signs of struggle. Victim's statement recorded separately at the hospital.",
      attachments: ["Crime Scene Photos", "Evidence Collection Report", "Forensic Samples List"],
    },
    {
      id: "entry-3",
      date: "2023-03-18",
      time: "11:00 AM",
      officer: "Inspector Sharma",
      location: "Connaught Place Police Station",
      description:
        "Witness statements recorded from two individuals who were present near the crime scene. Both witnesses identified the accused from the photo lineup. Their statements corroborate the victim's account of events.",
      attachments: ["Witness Statements", "Photo Lineup Results"],
    },
    {
      id: "entry-4",
      date: "2023-03-20",
      time: "04:30 PM",
      officer: "Inspector Sharma",
      location: "Forensic Lab, Delhi",
      description:
        "Forensic reports received. Fingerprints found at the scene match with the accused. Blood samples are still under analysis. CCTV footage from nearby shop recovered showing accused near the crime scene 30 minutes before the incident.",
      attachments: ["Forensic Report", "CCTV Footage Analysis"],
    },
  ]

  const filteredEntries = caseDiaryEntries.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.officer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.date.includes(searchQuery),
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Case Diary Integration</h1>
          <p className="text-muted-foreground">Access and review case diary entries and investigation documents</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search case diary entries..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Diary Entries List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Case Diary Entries</CardTitle>
                <CardDescription>FIR No. 123/2023, PS Connaught Place</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedEntry?.id === entry.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm">{entry.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">{entry.officer}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{entry.description}</p>
                        {entry.attachments.length > 0 && (
                          <div className="mt-2 flex items-center">
                            <FileText className="h-4 w-4 text-primary mr-2" />
                            <span className="text-xs text-primary">{entry.attachments.length} attachment(s)</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No entries found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Entry
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Entry Details */}
          <div className="lg:col-span-2">
            {selectedEntry ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Entry Details</CardTitle>
                      <CardDescription>
                        {new Date(selectedEntry.date).toLocaleDateString()} at {selectedEntry.time}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Date</Label>
                      <p className="font-medium">{new Date(selectedEntry.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Time</Label>
                      <p className="font-medium">{selectedEntry.time}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Officer</Label>
                      <p className="font-medium">{selectedEntry.officer}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Location</Label>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                        <p className="font-medium">{selectedEntry.location}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <p className="whitespace-pre-line">{selectedEntry.description}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Attachments</Label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedEntry.attachments.map((attachment, index) => (
                        <Button key={index} variant="outline" className="justify-start h-auto py-2">
                          <FileText className="mr-2 h-4 w-4 text-primary" />
                          <span className="text-sm">{attachment}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                      <div>
                        <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          Confidentiality Notice
                        </h5>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                          This case diary entry is confidential and should only be accessed by authorized personnel.
                          Unauthorized access or sharing of this information is punishable under law.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t flex justify-between">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Print Entry
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download All Attachments
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="pt-10 pb-10 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Case Diary Entry</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Choose an entry from the list on the left to view detailed information, including description and
                    attachments.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Document Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Case Documents</CardTitle>
            <CardDescription>
              Add investigation reports, witness statements, and other case-related documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload Documents</TabsTrigger>
                <TabsTrigger value="scan">Scan Documents</TabsTrigger>
                <TabsTrigger value="templates">Document Templates</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="p-4 border rounded-md mt-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support for PDF, DOCX, JPG, PNG files up to 10MB each
                  </p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="scan" className="p-4 border rounded-md mt-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Scan Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use your device camera to scan documents and add them to the case diary
                  </p>
                  <Button>Open Camera</Button>
                </div>
              </TabsContent>
              <TabsContent value="templates" className="p-4 border rounded-md mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <span>Witness Statement</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <span>Investigation Report</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <span>Evidence Collection</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

