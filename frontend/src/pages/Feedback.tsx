"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { MessageSquare, Star, Send, ThumbsUp, CheckCircle } from "lucide-react"
import DashboardLayout from "../components/layout/DashboardLayout"

export default function Feedback() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    feedbackType: "",
    subject: "",
    message: "",
    email: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send the feedback to the server
    console.log("Feedback submitted:", { ...formData, rating })
    setFeedbackSubmitted(true)
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground">Help us improve Rihai Yukti by sharing your feedback</p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <MessageSquare className="h-4 w-4 mr-2" />
              General Feedback
            </TabsTrigger>
            <TabsTrigger value="feature">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Feature Request
            </TabsTrigger>
            <TabsTrigger value="bug">
              <MessageSquare className="h-4 w-4 mr-2" />
              Report Issue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            {feedbackSubmitted ? (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Thank You for Your Feedback!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    We appreciate your input. Your feedback helps us improve Rihai Yukti for everyone.
                  </p>
                  <Button onClick={() => setFeedbackSubmitted(false)}>Submit Another Feedback</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>General Feedback</CardTitle>
                    <CardDescription>Share your thoughts about Rihai Yukti</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="feedback-type">Feedback Type</Label>
                      <Select onValueChange={(value) => handleChange("feedbackType", value)} required>
                        <SelectTrigger id="feedback-type">
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compliment">Compliment</SelectItem>
                          <SelectItem value="suggestion">Suggestion</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief subject of your feedback"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Your Feedback</Label>
                      <Textarea
                        id="message"
                        placeholder="Please share your detailed feedback here..."
                        className="min-h-[150px]"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email for follow-up"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        We'll only use this to follow up on your feedback if necessary.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Rate Your Experience</Label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button key={value} type="button" className="p-1" onClick={() => handleRatingClick(value)}>
                            <Star
                              className={`h-6 w-6 ${
                                rating !== null && value <= rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {rating ? `${rating} out of 5` : "Select a rating"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="feature">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Feature Request</CardTitle>
                  <CardDescription>Suggest new features or improvements for Rihai Yukti</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="feature-subject">Feature Name</Label>
                    <Input id="feature-subject" placeholder="Brief name of the feature" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feature-description">Feature Description</Label>
                    <Textarea
                      id="feature-description"
                      placeholder="Please describe the feature in detail..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feature-benefit">How would this feature benefit users?</Label>
                    <Textarea
                      id="feature-benefit"
                      placeholder="Explain how this feature would help users..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feature-email">Email (Optional)</Label>
                    <Input id="feature-email" type="email" placeholder="Your email for follow-up" />
                    <p className="text-xs text-muted-foreground">We'll notify you if we implement this feature.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feature Request
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="bug">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Report Issue</CardTitle>
                  <CardDescription>Report bugs or technical issues you've encountered</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue-type">Issue Type</Label>
                    <Select required>
                      <SelectTrigger id="issue-type">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">Bug/Error</SelectItem>
                        <SelectItem value="performance">Performance Issue</SelectItem>
                        <SelectItem value="ui">UI/UX Problem</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue-location">Where did you encounter the issue?</Label>
                    <Select required>
                      <SelectTrigger id="issue-location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calculator">Bail Calculator</SelectItem>
                        <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                        <SelectItem value="application">Application Generator</SelectItem>
                        <SelectItem value="database">Legal Database</SelectItem>
                        <SelectItem value="analytics">Predictive Analytics</SelectItem>
                        <SelectItem value="chatbot">BNS Chatbot</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue-description">Issue Description</Label>
                    <Textarea
                      id="issue-description"
                      placeholder="Please describe the issue in detail..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="steps-reproduce">Steps to Reproduce</Label>
                    <Textarea
                      id="steps-reproduce"
                      placeholder="List the steps to reproduce this issue..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue-email">Email (Optional)</Label>
                    <Input id="issue-email" type="email" placeholder="Your email for follow-up" />
                    <p className="text-xs text-muted-foreground">We'll update you when this issue is resolved.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Issue Report
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Feedback History */}
        <Card>
          <CardHeader>
            <CardTitle>Your Feedback History</CardTitle>
            <CardDescription>Previous feedback you've submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Feedback History</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't submitted any feedback yet. Your feedback helps us improve Rihai Yukti for everyone.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

