"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useToast } from "../../components/ui/toaster";
import {
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function JudgeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [todayHearings, setTodayHearings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingCases: 0,
    approvedCases: 0,
    rejectedCases: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch pending applications
        const pendingRes = await api.get("/applications/judge/pending");
        setPendingApplications(pendingRes.data);

        // Fetch today's hearings
        const hearingsRes = await api.get("/cases/judge/today");
        setTodayHearings(
          Object.values(hearingsRes.data)
            .flat()
            .map((hearing: any) => ({
              id: hearing._id,
              caseNumber: hearing.caseId?.caseNumber || "N/A",
              title: hearing.caseId?.title || "Unknown Case",
              time: hearing.time,
              court: hearing.location,
              type: hearing.purpose,
              complexity: hearing.caseId?.dcmCategory || "Standard",
            }))
        );

        // Fetch all applications for stats
        const allApplicationsRes = await api.get("/applications");
        const allApplications = allApplicationsRes.data;

        // Calculate stats
        setStats({
          totalCases: allApplications.length,
          pendingCases: allApplications.filter(
            (app: any) => app.status === "Pending"
          ).length,
          approvedCases: allApplications.filter(
            (app: any) => app.status === "Approved"
          ).length,
          rejectedCases: allApplications.filter(
            (app: any) => app.status === "Rejected"
          ).length,
        });

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err.response?.data?.msg ||
            "Failed to load dashboard data. Please try again."
        );
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewApplication = (id: string) => {
    navigate(`/judge/application/${id}`);
  };

  const handleViewCase = (id: string) => {
    navigate(`/judge/case/${id}`);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/applications/${id}`, { status });

      // Update local state
      setPendingApplications(
        pendingApplications.filter((app) => app._id !== id)
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        pendingCases: prev.pendingCases - 1,
        approvedCases:
          status === "Approved" ? prev.approvedCases + 1 : prev.approvedCases,
        rejectedCases:
          status === "Rejected" ? prev.rejectedCases + 1 : prev.rejectedCases,
      }));

      addToast({
        title: "Status Updated",
        description: `Application ${status.toLowerCase()} successfully`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error updating application status:", err);
      addToast({
        title: "Update Failed",
        description:
          err.response?.data?.msg || "Failed to update application status",
        type: "error",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Judge Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user?.firstName || "Judge"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold">{stats.totalCases}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Cases
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold">{stats.pendingCases}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Cases
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold">{stats.approvedCases}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rejected Cases
              </CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold">{stats.rejectedCases}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Bail Applications</CardTitle>
            <CardDescription>
              Applications awaiting your review and decision
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1"></div>
                          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                          <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : pendingApplications.length > 0 ? (
              <div className="space-y-4">
                {pendingApplications.map((application) => (
                  <div key={application._id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {application.applicant.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Application No: {application.applicationNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Filed on:{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-2">
                          <span className="font-medium">Sections:</span>{" "}
                          {application.case.sections.join(", ")}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleViewApplication(application._id)}
                        >
                          View Details
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() =>
                              handleUpdateStatus(application._id, "Approved")
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() =>
                              handleUpdateStatus(application._id, "Rejected")
                            }
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  No Pending Applications
                </h3>
                <p className="text-muted-foreground">
                  You have no pending bail applications to review.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Hearings */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Hearings</CardTitle>
            <CardDescription>Cases scheduled for hearing today</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1"></div>
                          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                        </div>
                        <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : todayHearings.length > 0 ? (
              <div className="space-y-4">
                {todayHearings.map((hearing) => (
                  <div key={hearing.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{hearing.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Case No: {hearing.caseNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Time: {hearing.time} | Court: {hearing.court}
                        </p>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              hearing.complexity === "Complex"
                                ? "bg-purple-100 text-purple-800"
                                : hearing.complexity === "Expedited"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {hearing.type || hearing.complexity}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleViewCase(hearing.id)}
                      >
                        View Case
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">No Hearings Today</h3>
                <p className="text-muted-foreground">
                  You have no hearings scheduled for today.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
