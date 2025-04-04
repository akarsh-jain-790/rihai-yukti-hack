"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { useToast } from "../../components/ui/toaster";
import {
  Loader2,
  AlertCircle,
  FileText,
  Calendar,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { caseService, riskAssessmentService } from "../../services/api";

export default function JudgeCaseView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [caseDetails, setCaseDetails] = useState<any | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!id) {
        setError("Case ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch case details and risk assessment in parallel
        const [caseResponse, riskResponse] = await Promise.all([
          caseService.getCaseById(id),
          riskAssessmentService.getRiskAssessment(id).catch(() => null), // Don't fail if risk assessment doesn't exist
        ]);

        setCaseDetails(caseResponse);
        setRiskAssessment(riskResponse);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching case details:", err);
        setError(
          err.response?.data?.msg ||
            "Failed to load case details. Please try again."
        );
        setLoading(false);
        addToast({
          title: "Error",
          description: "Failed to load case details",
          type: "error",
        });
      }
    };

    fetchCaseDetails();
  }, [id, addToast]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);

      // Update case status via API
      await caseService.updateCase(id!, { status: newStatus });

      // Update local state
      setCaseDetails((prev) => (prev ? { ...prev, status: newStatus } : null));

      addToast({
        title: "Status Updated",
        description: `Case status updated to ${newStatus}`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error updating case status:", err);
      addToast({
        title: "Update Failed",
        description:
          err.response?.data?.msg ||
          "Failed to update case status. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleHearing = () => {
    navigate(`/judge/schedule-hearing/${id}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading case details...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !caseDetails) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Case details not found"}
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {caseDetails.title}
            </h1>
            <p className="text-muted-foreground">
              Case Number: {caseDetails.caseNumber}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button onClick={handleScheduleHearing}>Schedule Hearing</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Case Overview</CardTitle>
              <CardDescription>
                Details and current status of the case
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Court
                  </h3>
                  <p>{caseDetails.court}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Judge
                  </h3>
                  <p>{caseDetails.judge}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Filing Date
                  </h3>
                  <p>{new Date(caseDetails.filingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Next Hearing
                  </h3>
                  <p>
                    {caseDetails.nextHearingDate
                      ? new Date(
                          caseDetails.nextHearingDate
                        ).toLocaleDateString()
                      : "Not scheduled"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Applicant
                  </h3>
                  <p>{caseDetails.applicant?.name || caseDetails.applicant}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Respondent
                  </h3>
                  <p>{caseDetails.respondent}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">
                  Charges
                </h3>
                <ul className="list-disc list-inside">
                  {caseDetails.charges &&
                    caseDetails.charges.map((charge: string, index: number) => (
                      <li key={index}>{charge}</li>
                    ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">
                  Description
                </h3>
                <p>{caseDetails.description}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                <span className="font-medium text-sm text-muted-foreground mr-2">
                  Current Status:
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    caseDetails.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : caseDetails.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : caseDetails.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {caseDetails.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate("Approved")}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  disabled={caseDetails.status === "Approved"}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate("Rejected")}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  disabled={caseDetails.status === "Rejected"}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Bail risk evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              {riskAssessment ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risk Score</span>
                    <span className="font-bold">
                      {riskAssessment.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        riskAssessment.level === "Low"
                          ? "bg-green-500"
                          : riskAssessment.level === "Medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${riskAssessment.score}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                  <div className="pt-4">
                    <h3 className="font-medium text-sm mb-2">Risk Factors</h3>
                    <ul className="space-y-1">
                      {riskAssessment.factors.map(
                        (factor: string, index: number) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="mr-2">•</span>
                            <span>{factor}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    No risk assessment available
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate(`/risk-assessment/${id}`)}
                  >
                    Perform Risk Assessment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="hearings" className="w-full">
          <TabsList>
            <TabsTrigger value="hearings" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Hearings
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="parties" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Parties
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hearings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Hearing History</CardTitle>
                <CardDescription>
                  Past and upcoming hearings for this case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseDetails.hearings && caseDetails.hearings.length > 0 ? (
                    caseDetails.hearings.map((hearing: any, index: number) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              {hearing.type || hearing.purpose}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(hearing.date).toLocaleDateString()} at{" "}
                              {hearing.time}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                        <p className="text-sm mt-2">{hearing.notes}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No hearings scheduled for this case yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleScheduleHearing}
                >
                  Schedule New Hearing
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Documents</CardTitle>
                <CardDescription>
                  All documents related to this case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {caseDetails.documents && caseDetails.documents.length > 0 ? (
                    caseDetails.documents.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 hover:bg-muted rounded-md"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Added on {new Date(doc.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No documents available for this case.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Upload Document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="parties" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Parties</CardTitle>
                <CardDescription>
                  Individuals and entities involved in this case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Applicant</h3>
                    <div className="p-3 border rounded-md">
                      <p className="font-medium">
                        {caseDetails.applicant?.name || caseDetails.applicant}
                      </p>
                      {caseDetails.applicant?.address && (
                        <p className="text-sm text-muted-foreground">
                          Address: {caseDetails.applicant.address}
                        </p>
                      )}
                      {caseDetails.applicant?.phone && (
                        <p className="text-sm text-muted-foreground">
                          Phone: {caseDetails.applicant.phone}
                        </p>
                      )}
                      {caseDetails.applicant?.email && (
                        <p className="text-sm text-muted-foreground">
                          Email: {caseDetails.applicant.email}
                        </p>
                      )}
                    </div>
                  </div>
                  {caseDetails.lawyer && (
                    <div>
                      <h3 className="font-medium mb-2">Lawyer</h3>
                      <div className="p-3 border rounded-md">
                        <p className="font-medium">{caseDetails.lawyer.name}</p>
                        {caseDetails.lawyer.barCouncilNumber && (
                          <p className="text-sm text-muted-foreground">
                            Bar Council Number:{" "}
                            {caseDetails.lawyer.barCouncilNumber}
                          </p>
                        )}
                        {caseDetails.lawyer.phone && (
                          <p className="text-sm text-muted-foreground">
                            Phone: {caseDetails.lawyer.phone}
                          </p>
                        )}
                        {caseDetails.lawyer.email && (
                          <p className="text-sm text-muted-foreground">
                            Email: {caseDetails.lawyer.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
