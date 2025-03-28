"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Calendar, Clock, CalendarIcon } from "lucide-react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { judgeService } from "../../services/api"
import { useToast } from "../../components/ui/toaster"

export default function JudgeCalendar() {
  const [hearings, setHearings] = useState([])
  const [todayCases, setTodayCases] = useState({
    Expedited: [],
    Standard: [],
    Complex: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [calendarData, todayData] = await Promise.all([judgeService.getCalendar(), judgeService.getTodayCases()])
        setHearings(calendarData)
        setTodayCases(todayData)
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to fetch calendar data",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [addToast])

  const handleViewCase = (caseId) => {
    navigate(`/judge/case/${caseId}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Judicial Calendar</h1>
          <p className="text-muted-foreground">Manage your hearings and case schedule</p>
        </div>

        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Today's Hearings
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <Calendar className="mr-2 h-4 w-4" />
              Upcoming Hearings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <div className="grid grid-cols-1 gap-6">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Expedited Cases */}
                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        Expedited Cases
                      </CardTitle>
                      <CardDescription>High priority cases requiring immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {todayCases.Expedited && todayCases.Expedited.length > 0 ? (
                        <div className="space-y-4">
                          {todayCases.Expedited.map((hearing) => (
                            <div
                              key={hearing._id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                            >
                              <div>
                                <div className="font-medium">{hearing.caseId.caseNumber}</div>
                                <div className="text-sm text-muted-foreground">
                                  {hearing.caseId.applicant.firstName} {hearing.caseId.applicant.lastName} |{" "}
                                  {hearing.time}
                                </div>
                              </div>
                              <Button onClick={() => handleViewCase(hearing.caseId._id)}>View Case</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          No expedited cases scheduled for today
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Standard Cases */}
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        Standard Cases
                      </CardTitle>
                      <CardDescription>Regular bail applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {todayCases.Standard && todayCases.Standard.length > 0 ? (
                        <div className="space-y-4">
                          {todayCases.Standard.map((hearing) => (
                            <div
                              key={hearing._id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                            >
                              <div>
                                <div className="font-medium">{hearing.caseId.caseNumber}</div>
                                <div className="text-sm text-muted-foreground">
                                  {hearing.caseId.applicant.firstName} {hearing.caseId.applicant.lastName} |{" "}
                                  {hearing.time}
                                </div>
                              </div>
                              <Button onClick={() => handleViewCase(hearing.caseId._id)}>View Case</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          No standard cases scheduled for today
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Complex Cases */}
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                        Complex Cases
                      </CardTitle>
                      <CardDescription>Cases requiring detailed consideration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {todayCases.Complex && todayCases.Complex.length > 0 ? (
                        <div className="space-y-4">
                          {todayCases.Complex.map((hearing) => (
                            <div
                              key={hearing._id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                            >
                              <div>
                                <div className="font-medium">{hearing.caseId.caseNumber}</div>
                                <div className="text-sm text-muted-foreground">
                                  {hearing.caseId.applicant.firstName} {hearing.caseId.applicant.lastName} |{" "}
                                  {hearing.time}
                                </div>
                              </div>
                              <Button onClick={() => handleViewCase(hearing.caseId._id)}>View Case</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          No complex cases scheduled for today
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Hearings</CardTitle>
                <CardDescription>Your scheduled hearings for the coming days</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : hearings.length > 0 ? (
                  <div className="space-y-6">
                    {hearings
                      .reduce((acc, hearing) => {
                        const dateKey = formatDate(hearing.date)
                        if (!acc[dateKey]) {
                          acc[dateKey] = []
                        }
                        acc[dateKey].push(hearing)
                        return acc
                      }, {})
                      // Convert to array of [date, hearings] pairs and sort by date
                      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                      // Map to JSX
                      .map(([date, dayHearings]) => (
                        <div key={date}>
                          <h3 className="font-medium text-lg mb-3">{date}</h3>
                          <div className="space-y-3">
                            {dayHearings.map((hearing) => (
                              <div
                                key={hearing._id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{hearing.caseId.caseNumber}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {hearing.caseId.applicant.firstName} {hearing.caseId.applicant.lastName} |{" "}
                                      {hearing.time}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">{hearing.purpose}</div>
                                  </div>
                                </div>
                                <Button onClick={() => handleViewCase(hearing.caseId._id)}>View Case</Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No upcoming hearings scheduled</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

