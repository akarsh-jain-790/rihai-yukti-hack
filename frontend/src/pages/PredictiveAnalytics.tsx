"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { BarChart4, PieChart, TrendingUp, FileText, Info, Download, BarChart, LineChart } from "lucide-react"
import DashboardLayout from "../components/layout/DashboardLayout"

export default function PredictiveAnalytics() {
  const [predictionResult, setPredictionResult] = useState<null | {
    approvalProbability: number
    factors: {
      name: string
      impact: number
      direction: "positive" | "negative"
    }[]
    similarCases: {
      caseNumber: string
      court: string
      outcome: "Approved" | "Rejected"
      similarity: number
    }[]
    recommendation: string
  }>(null)

  const [formData, setFormData] = useState({
    offenseType: "",
    courtType: "",
    judge: "",
    applicantAge: "",
    timeInCustody: "",
    priorConvictions: "",
    flightRisk: "",
    caseStrength: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePredict = () => {
    // Simulate prediction result
    setPredictionResult({
      approvalProbability: 68,
      factors: [
        { name: "Time in Custody", impact: 0.25, direction: "positive" },
        { name: "Prior Convictions", impact: 0.2, direction: "negative" },
        { name: "Flight Risk", impact: 0.15, direction: "negative" },
        { name: "Case Strength", impact: 0.3, direction: "positive" },
        { name: "Applicant Age", impact: 0.1, direction: "positive" },
      ],
      similarCases: [
        { caseNumber: "BA-234/2022", court: "Sessions Court, Delhi", outcome: "Approved", similarity: 87 },
        { caseNumber: "BA-156/2022", court: "Sessions Court, Mumbai", outcome: "Approved", similarity: 82 },
        { caseNumber: "BA-098/2022", court: "High Court, Delhi", outcome: "Rejected", similarity: 75 },
        { caseNumber: "BA-345/2022", court: "Sessions Court, Delhi", outcome: "Approved", similarity: 72 },
      ],
      recommendation:
        "Based on the analysis of similar cases and the factors involved, there is a moderate to high probability of bail approval. Consider emphasizing the time already spent in custody and the relatively weak case strength in your bail application.",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Predictive Analytics</h1>
          <p className="text-muted-foreground">Predict bail approval likelihood based on historical case data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Case Parameters</CardTitle>
                <CardDescription>Enter case details to predict bail approval likelihood</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="offense-type">Offense Type</Label>
                  <Select onValueChange={(value) => handleChange("offenseType", value)}>
                    <SelectTrigger id="offense-type">
                      <SelectValue placeholder="Select offense type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bailable">Bailable Offense</SelectItem>
                      <SelectItem value="non-bailable">Non-Bailable Offense</SelectItem>
                      <SelectItem value="economic">Economic Offense</SelectItem>
                      <SelectItem value="violent">Violent Crime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="court-type">Court Type</Label>
                  <Select onValueChange={(value) => handleChange("courtType", value)}>
                    <SelectTrigger id="court-type">
                      <SelectValue placeholder="Select court type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sessions">Sessions Court</SelectItem>
                      <SelectItem value="high">High Court</SelectItem>
                      <SelectItem value="magistrate">Magistrate Court</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="judge">Judge</Label>
                  <Select onValueChange={(value) => handleChange("judge", value)}>
                    <SelectTrigger id="judge">
                      <SelectValue placeholder="Select judge (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="judge-sharma">Judge Sharma</SelectItem>
                      <SelectItem value="judge-patel">Judge Patel</SelectItem>
                      <SelectItem value="judge-kumar">Judge Kumar</SelectItem>
                      <SelectItem value="judge-rao">Judge Rao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicant-age">Applicant Age</Label>
                  <Input
                    id="applicant-age"
                    type="number"
                    placeholder="Enter age"
                    value={formData.applicantAge}
                    onChange={(e) => handleChange("applicantAge", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-in-custody">Time in Custody (Months)</Label>
                  <Input
                    id="time-in-custody"
                    type="number"
                    placeholder="Enter months"
                    value={formData.timeInCustody}
                    onChange={(e) => handleChange("timeInCustody", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prior-convictions">Prior Convictions</Label>
                  <Select onValueChange={(value) => handleChange("priorConvictions", value)}>
                    <SelectTrigger id="prior-convictions">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="one">One</SelectItem>
                      <SelectItem value="multiple">Multiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight-risk">Flight Risk</Label>
                  <Select onValueChange={(value) => handleChange("flightRisk", value)}>
                    <SelectTrigger id="flight-risk">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="case-strength">Prosecution Case Strength</Label>
                  <Select onValueChange={(value) => handleChange("caseStrength", value)}>
                    <SelectTrigger id="case-strength">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">Weak</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePredict} className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Predict Approval Likelihood
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Prediction Results */}
          <div className="lg:col-span-2">
            {predictionResult ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Prediction Results</CardTitle>
                      <CardDescription>Based on machine learning analysis of similar cases</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Probability Gauge */}
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-4">Bail Approval Probability</h3>
                    <div className="relative mx-auto w-48 h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-bold">{predictionResult.approvalProbability}%</div>
                      </div>
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="10"
                          strokeDasharray={`${predictionResult.approvalProbability * 2.83} 283`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {predictionResult.approvalProbability < 40
                        ? "Low probability of approval"
                        : predictionResult.approvalProbability < 70
                          ? "Moderate probability of approval"
                          : "High probability of approval"}
                    </div>
                  </div>

                  <Tabs defaultValue="factors">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="factors">
                        <BarChart className="h-4 w-4 mr-2" />
                        Key Factors
                      </TabsTrigger>
                      <TabsTrigger value="similar-cases">
                        <FileText className="h-4 w-4 mr-2" />
                        Similar Cases
                      </TabsTrigger>
                      <TabsTrigger value="recommendation">
                        <Info className="h-4 w-4 mr-2" />
                        Recommendation
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="factors" className="p-4 border rounded-md mt-4">
                      <h3 className="text-lg font-medium mb-4">Influential Factors</h3>
                      <div className="space-y-4">
                        {predictionResult.factors.map((factor, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{factor.name}</span>
                              <span
                                className={`text-sm ${factor.direction === "positive" ? "text-green-500" : "text-red-500"}`}
                              >
                                {factor.direction === "positive" ? "Positive" : "Negative"} Impact
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${factor.direction === "positive" ? "bg-green-500" : "bg-red-500"}`}
                                style={{ width: `${factor.impact * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Impact: {(factor.impact * 100).toFixed(0)}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="similar-cases" className="p-4 border rounded-md mt-4">
                      <h3 className="text-lg font-medium mb-4">Similar Cases</h3>
                      <div className="space-y-3">
                        {predictionResult.similarCases.map((caseItem, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <div className="font-medium">{caseItem.caseNumber}</div>
                              <div className="text-sm text-muted-foreground">{caseItem.court}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  caseItem.outcome === "Approved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {caseItem.outcome}
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Similarity: </span>
                                <span className="font-medium">{caseItem.similarity}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <Button variant="outline" size="sm">
                          View All Similar Cases
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="recommendation" className="p-4 border rounded-md mt-4">
                      <h3 className="text-lg font-medium mb-4">AI Recommendation</h3>
                      <div className="p-4 bg-muted rounded-md">
                        <p className="text-sm">{predictionResult.recommendation}</p>
                      </div>
                      <div className="mt-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                          <div>
                            <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Disclaimer</h5>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                              This prediction is based on historical data and machine learning models. It should be used
                              as a reference only and not as a substitute for legal advice. Each case is unique and may
                              have specific circumstances not captured by the model.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t flex justify-between">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Use in Application
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="pt-10 pb-10 text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Predictive Analytics</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Enter case parameters on the left to predict bail approval likelihood based on historical case data
                    and machine learning models.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Historical Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Historical Analytics</CardTitle>
            <CardDescription>Insights from past bail applications and judicial decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="approval-rates">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="approval-rates">
                  <BarChart className="h-4 w-4 mr-2" />
                  Approval Rates
                </TabsTrigger>
                <TabsTrigger value="judge-analysis">
                  <PieChart className="h-4 w-4 mr-2" />
                  Judge Analysis
                </TabsTrigger>
                <TabsTrigger value="time-trends">
                  <LineChart className="h-4 w-4 mr-2" />
                  Time Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="approval-rates" className="p-4 border rounded-md mt-4">
                <div className="text-center p-8">
                  <BarChart4 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Bail Approval Rates by Offense Type</h3>
                  <p className="text-sm text-muted-foreground mb-4">Bar chart visualization would be displayed here</p>
                </div>
              </TabsContent>

              <TabsContent value="judge-analysis" className="p-4 border rounded-md mt-4">
                <div className="text-center p-8">
                  <PieChart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Judge-wise Bail Approval Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-4">Pie chart visualization would be displayed here</p>
                </div>
              </TabsContent>

              <TabsContent value="time-trends" className="p-4 border rounded-md mt-4">
                <div className="text-center p-8">
                  <LineChart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Bail Approval Trends Over Time</h3>
                  <p className="text-sm text-muted-foreground mb-4">Line chart visualization would be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

