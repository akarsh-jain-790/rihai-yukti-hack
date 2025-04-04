"use client"

import { useState } from "react"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { AlertCircle, Calculator, Calendar } from "lucide-react"
import { useToast } from "../components/ui/toaster"

interface TimeSpent {
  years: number
  months: number
  days: number
  totalDays: number
}

export default function PrisonTimeCalculator() {
  const { addToast } = useToast()
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [deductionDays, setDeductionDays] = useState<string>("0")
  const [additionalDays, setAdditionalDays] = useState<string>("0")
  const [timeSpent, setTimeSpent] = useState<TimeSpent | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculateTimeSpent = () => {
    try {
      setError(null)

      // Validate inputs
      if (!startDate) {
        setError("Please enter a start date")
        return
      }

      if (!endDate) {
        setError("Please enter an end date")
        return
      }

      const start = new Date(startDate)
      const end = new Date(endDate)

      // Validate dates
      if (isNaN(start.getTime())) {
        setError("Invalid start date")
        return
      }

      if (isNaN(end.getTime())) {
        setError("Invalid end date")
        return
      }

      if (end < start) {
        setError("End date cannot be before start date")
        return
      }

      // Calculate total days
      const timeDiff = end.getTime() - start.getTime()
      let totalDays = Math.floor(timeDiff / (1000 * 3600 * 24))

      // Apply deductions and additions
      const deductions = Number.parseInt(deductionDays) || 0
      const additions = Number.parseInt(additionalDays) || 0

      totalDays = totalDays - deductions + additions

      if (totalDays < 0) {
        totalDays = 0
      }

      // Convert to years, months, days
      const years = Math.floor(totalDays / 365)
      const remainingDaysAfterYears = totalDays % 365
      const months = Math.floor(remainingDaysAfterYears / 30)
      const days = remainingDaysAfterYears % 30

      setTimeSpent({
        years,
        months,
        days,
        totalDays,
      })

      addToast({
        title: "Calculation Complete",
        description: "Prison time has been calculated successfully",
        type: "success",
      })
    } catch (err: any) {
      console.error("Error calculating time:", err)
      setError(err.message || "An error occurred during calculation")
      addToast({
        title: "Calculation Error",
        description: err.message || "An error occurred during calculation",
        type: "error",
      })
    }
  }

  const resetCalculator = () => {
    setStartDate("")
    setEndDate("")
    setDeductionDays("0")
    setAdditionalDays("0")
    setTimeSpent(null)
    setError(null)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Prison Time Calculator</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculate Time Spent</CardTitle>
              <CardDescription>Enter the start and end dates to calculate the time spent in custody</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deductionDays">Deduction Days (e.g., parole, bail)</Label>
                <div className="relative">
                  <Input
                    id="deductionDays"
                    type="number"
                    min="0"
                    value={deductionDays}
                    onChange={(e) => setDeductionDays(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalDays">Additional Days (e.g., previous custody)</Label>
                <div className="relative">
                  <Input
                    id="additionalDays"
                    type="number"
                    min="0"
                    value={additionalDays}
                    onChange={(e) => setAdditionalDays(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetCalculator}>
                Reset
              </Button>
              <Button onClick={calculateTimeSpent}>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Time spent in custody based on the provided dates</CardDescription>
            </CardHeader>
            <CardContent>
              {timeSpent ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-3xl font-bold">{timeSpent.years}</p>
                      <p className="text-sm text-muted-foreground">Years</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-3xl font-bold">{timeSpent.months}</p>
                      <p className="text-sm text-muted-foreground">Months</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-3xl font-bold">{timeSpent.days}</p>
                      <p className="text-sm text-muted-foreground">Days</p>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Total Days</p>
                    <p className="text-2xl font-bold">{timeSpent.totalDays}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Legal Considerations</h3>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Time spent in custody is typically counted as part of the sentence</li>
                      <li>Some jurisdictions may count partial days as full days</li>
                      <li>Good behavior credits may apply in some cases</li>
                      <li>This calculation is for informational purposes only</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Calculator className="h-12 w-12 mb-4 opacity-20" />
                  <p>Enter dates and click Calculate to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

