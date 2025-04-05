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
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "../../services/api";

export default function JudgeApplicationView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!id) {
        setError("Application ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/applications/${id}`);
        setApplication(response.data);
      } catch (err: any) {
        console.error("Error fetching application details:", err);
        setError(
          err.response?.data?.msg ||
            "Failed to load application details. Please try again."
        );
        addToast({
          title: "Error",
          description: "Failed to load application details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id, addToast]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setStatusUpdateLoading(true);
      setError(null);

      // Update application status via API
      await api.put(`/applications/${id}`, {
        status: newStatus,
        notes: `Application ${newStatus.toLowerCase()} by judge`,
      });

      // Update local state
      setApplication((prev: any) =>
        prev ? { ...prev, status: newStatus } : null
      );

      addToast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error updating application status:", err);
      setError(
        err.response?.data?.msg ||
          "Failed to update application status. Please try again."
      );
      addToast({
        title: "Update Failed",
        description:
          err.response?.data?.msg ||
          "Failed to update application status. Please try again.",
        type: "error",
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleScheduleHearing = () => {
    navigate(`/judge/schedule-hearing/${id}?type=application`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading application details...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Application details not found"}
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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Bail Application
            </h1>
            <p className="text-muted-foreground">
              Application Number: {application.applicationNumber}
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
              <CardTitle>Application Overview</CardTitle>
              <CardDescription>
                Details and current status of the bail application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Applicant Name
                  </h3>
                  <p>{application.applicant.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Age / Gender
                  </h3>
                  <p>
                    {application.applicant.age} / {application.applicant.gender}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Occupation
                  </h3>
                  <p>{application.applicant.occupation || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Address
                  </h3>
                  <p>{application.applicant.address}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Contact
                  </h3>
                  <p>
                    {application.applicant.phone &&
                      `Phone: ${application.applicant.phone}`}
                    {application.applicant.email &&
                      application.applicant.phone && <br />}
                    {application.applicant.email &&
                      `Email: ${application.applicant.email}`}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Filing Date
                  </h3>
                  <p>{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Case Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      FIR/Case Number
                    </h3>
                    <p>{application.case.firNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Police Station
                    </h3>
                    <p>{application.case.policeStation}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Court
                    </h3>
                    <p>{application.case.court}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Date of Arrest
                    </h3>
                    <p>
                      {application.case.arrestDate
                        ? new Date(
                            application.case.arrestDate
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Sections Applied
                    </h3>
                    <p>{application.case.sections.join(", ")}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Allegations
                    </h3>
                    <p>{application.case.allegations}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Custody Status
                    </h3>
                    <p>{application.case.custodyStatus}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Period in Custody
                    </h3>
                    <p>{application.case.custodyPeriod || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Grounds for Bail</h3>
                <p className="whitespace-pre-line">
                  {application.bail.grounds}
                </p>

                {application.bail.previousApplications &&
                  application.bail.previousApplications !== "none" && (
                    <div className="mt-4">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Previous Bail Applications
                      </h3>
                      <p>{application.bail.previousApplications}</p>
                    </div>
                  )}

                {application.bail.proposedConditions && (
                  <div className="mt-4">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Proposed Bail Conditions
                    </h3>
                    <p>{application.bail.proposedConditions}</p>
                  </div>
                )}

                {application.bail.customConditions && (
                  <div className="mt-4">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Custom Bail Conditions
                    </h3>
                    <p>{application.bail.customConditions}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                <span className="font-medium text-sm text-muted-foreground mr-2">
                  Current Status:
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    application.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : application.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {application.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate("Approved")}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  disabled={
                    application.status === "Approved" || statusUpdateLoading
                  }
                >
                  {statusUpdateLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  )}
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate("Rejected")}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  disabled={
                    application.status === "Rejected" || statusUpdateLoading
                  }
                >
                  {statusUpdateLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  Reject
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application History</CardTitle>
              <CardDescription>Timeline of updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.updates && application.updates.length > 0 ? (
                  application.updates.map((update: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-2 border-muted pl-4 pb-4"
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">{update.description}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(update.date).toLocaleDateString()} at{" "}
                        {new Date(update.date).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No updates available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList>
            <TabsTrigger value="documents" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="hearings" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Hearings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Documents</CardTitle>
                <CardDescription>
                  All documents related to this application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {application.documents && application.documents.length > 0 ? (
                    application.documents.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 hover:bg-muted rounded-md"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Added on{" "}
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={doc.fileUrl}
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
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No documents available for this application.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Download Application
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="hearings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Hearings</CardTitle>
                <CardDescription>
                  Hearings related to this application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {application.hearingDate ? (
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Bail Hearing</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            application.hearingDate
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            application.hearingDate
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No hearings scheduled for this application.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={handleScheduleHearing}
                    >
                      Schedule Hearing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
