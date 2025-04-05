"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useToast } from "../components/ui/toaster";
import {
  FileText,
  Download,
  Printer,
  Eye,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ApplicationGenerator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationGenerated, setApplicationGenerated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedApplicationId, setGeneratedApplicationId] = useState<
    string | null
  >(null);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    age: "",
    gender: "Male",
    occupation: "",
    address: "",
    phone: "",
    email: "",

    // Case Details
    firNumber: "",
    policeStation: "",
    court: "High Court",
    arrestDate: "",
    sections: "",
    allegations: "",
    custodyStatus: "police",
    custodyPeriod: "",

    // Grounds for Bail
    bailGrounds: "",
    previousBail: "one",
    bailConditions: "standard conditions",
    customConditions: "",
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNextStep = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitApplication();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate the current step
  const validateCurrentStep = () => {
    setError(null);

    if (currentStep === 1) {
      // Validate personal details
      if (!formData.fullName) {
        setError("Full name is required");
        return false;
      }
      if (!formData.age) {
        setError("Age is required");
        return false;
      }
      if (!formData.gender) {
        setError("Gender is required");
        return false;
      }
      if (!formData.address) {
        setError("Address is required");
        return false;
      }
    } else if (currentStep === 2) {
      // Validate case details
      if (!formData.firNumber) {
        setError("FIR/Case number is required");
        return false;
      }
      if (!formData.policeStation) {
        setError("Police station is required");
        return false;
      }
      if (!formData.court) {
        setError("Court is required");
        return false;
      }
      if (!formData.sections) {
        setError("Sections applied are required");
        return false;
      }
      if (!formData.allegations) {
        setError("Allegations description is required");
        return false;
      }
    } else if (currentStep === 3) {
      // Validate grounds for bail
      if (!formData.bailGrounds) {
        setError("Grounds for bail are required");
        return false;
      }
    }

    return true;
  };

  // Submit application to backend
  const handleSubmitApplication = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Prepare data for API
      const applicationData = {
        applicant: {
          name: formData.fullName,
          age: Number.parseInt(formData.age),
          gender: formData.gender,
          occupation: formData.occupation,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
        },
        case: {
          firNumber: formData.firNumber,
          policeStation: formData.policeStation,
          court: formData.court,
          arrestDate: formData.arrestDate,
          sections: formData.sections.split(",").map((s) => s.trim()),
          allegations: formData.allegations,
          custodyStatus: formData.custodyStatus,
          custodyPeriod: formData.custodyPeriod,
        },
        bail: {
          grounds: formData.bailGrounds,
          previousApplications: formData.previousBail,
          proposedConditions: formData.bailConditions,
          customConditions: formData.customConditions,
        },
        status: "Pending",
        createdBy: user?.id,
        applicantId: user?.id,
      };

      // Submit to API
      const response = await api.post("/applications", applicationData);

      // Set the generated application ID
      setGeneratedApplicationId(response.data._id || response.data.id);

      // Show success message
      addToast({
        title: "Application Generated",
        description:
          "Your bail application has been successfully generated and submitted.",
        type: "success",
      });

      // Move to the final step
      setApplicationGenerated(true);
    } catch (err: any) {
      console.error("Error submitting application:", err);
      setError(
        err.response?.data?.msg ||
          "Failed to submit application. Please try again."
      );
      addToast({
        title: "Submission Failed",
        description:
          "There was an error submitting your application. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle download application
  const handleDownloadApplication = async (format: string) => {
    try {
      if (!generatedApplicationId) {
        throw new Error("Application ID is missing");
      }

      const response = await api.get(
        `/applications/${generatedApplicationId}/download?format=${format}`,
        {
          responseType: "blob",
        }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bail-application.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      addToast({
        title: "Download Started",
        description: `Your application is being downloaded in ${format.toUpperCase()} format.`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error downloading application:", err);
      addToast({
        title: "Download Failed",
        description:
          "There was an error downloading your application. Please try again.",
        type: "error",
      });
    }
  };

  // Handle share application
  const handleShareApplication = async (email: string) => {
    try {
      if (!generatedApplicationId) {
        throw new Error("Application ID is missing");
      }

      await api.post(`/applications/${generatedApplicationId}/share`, {
        email,
      });

      addToast({
        title: "Application Shared",
        description: `Your application has been shared with ${email}.`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error sharing application:", err);
      addToast({
        title: "Share Failed",
        description:
          "There was an error sharing your application. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bail Application Generator
          </h1>
          <p className="text-muted-foreground">
            Generate compliant bail applications with just a few clicks
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Progress Steps */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                    step <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    step <= currentStep
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {step === 1 && "Personal Details"}
                  {step === 2 && "Case Details"}
                  {step === 3 && "Grounds for Bail"}
                  {step === 4 && "Review & Generate"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        {!applicationGenerated ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Personal Details"}
                {currentStep === 2 && "Case Details"}
                {currentStep === 3 && "Grounds for Bail"}
                {currentStep === 4 && "Review & Generate"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Enter personal details of the accused"}
                {currentStep === 2 &&
                  "Enter details about the case and charges"}
                {currentStep === 3 && "Specify grounds for seeking bail"}
                {currentStep === 4 &&
                  "Review all information before generating the application"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter age"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        placeholder="Enter occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Residential Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter complete address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Case Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firNumber">FIR/Case Number</Label>
                      <Input
                        id="firNumber"
                        placeholder="Enter FIR/Case number"
                        value={formData.firNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policeStation">Police Station</Label>
                      <Input
                        id="policeStation"
                        placeholder="Enter police station"
                        value={formData.policeStation}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="court">Court</Label>
                      <Select
                        value={formData.court}
                        onValueChange={(value) =>
                          handleSelectChange("court", value)
                        }
                      >
                        <SelectTrigger id="court">
                          <SelectValue placeholder="Select court" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sessions">
                            Sessions Court
                          </SelectItem>
                          <SelectItem value="high">High Court</SelectItem>
                          <SelectItem value="magistrate">
                            Magistrate Court
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="arrestDate">Date of Arrest</Label>
                      <Input
                        id="arrestDate"
                        type="date"
                        value={formData.arrestDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="sections">Sections Applied</Label>
                      <Input
                        id="sections"
                        placeholder="e.g., BNS 103, 109, 115"
                        value={formData.sections}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="allegations">
                        Brief Description of Allegations
                      </Label>
                      <Textarea
                        id="allegations"
                        placeholder="Describe the allegations briefly"
                        value={formData.allegations}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custodyStatus">Custody Status</Label>
                      <Select
                        value={formData.custodyStatus}
                        onValueChange={(value) =>
                          handleSelectChange("custodyStatus", value)
                        }
                      >
                        <SelectTrigger id="custodyStatus">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="police">Police Custody</SelectItem>
                          <SelectItem value="judicial">
                            Judicial Custody
                          </SelectItem>
                          <SelectItem value="not-arrested">
                            Not Yet Arrested
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custodyPeriod">Period in Custody</Label>
                      <Input
                        id="custodyPeriod"
                        placeholder="e.g., 30 days"
                        value={formData.custodyPeriod}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Grounds for Bail */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bailGrounds">Grounds for Bail</Label>
                    <Textarea
                      id="bailGrounds"
                      placeholder="Enter grounds for bail application"
                      className="min-h-[150px]"
                      value={formData.bailGrounds}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">
                      Suggested Grounds for Bail
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>
                        The accused has no prior criminal record and is a
                        first-time offender.
                      </li>
                      <li>
                        The accused has strong roots in the community and is not
                        a flight risk.
                      </li>
                      <li>
                        The investigation is complete, and custody is no longer
                        required.
                      </li>
                      <li>
                        The accused has been in custody for a substantial period
                        (mention specific time).
                      </li>
                      <li>The alleged offense is bailable in nature.</li>
                      <li>
                        The accused is eligible for bail under Section 436A of
                        CrPC having served half the maximum sentence.
                      </li>
                      <li>
                        The accused is the sole breadwinner of the family.
                      </li>
                      <li>
                        The accused requires medical attention that cannot be
                        provided in custody.
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="previousBail">
                        Previous Bail Applications
                      </Label>
                      <Select
                        value={formData.previousBail}
                        onValueChange={(value) =>
                          handleSelectChange("previousBail", value)
                        }
                      >
                        <SelectTrigger id="previousBail">
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
                      <Label htmlFor="bailConditions">
                        Proposed Bail Conditions
                      </Label>
                      <Select
                        value={formData.bailConditions}
                        onValueChange={(value) =>
                          handleSelectChange("bailConditions", value)
                        }
                      >
                        <SelectTrigger id="bailConditions">
                          <SelectValue placeholder="Select conditions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">
                            Standard Conditions
                          </SelectItem>
                          <SelectItem value="reporting">
                            Regular Reporting to Police
                          </SelectItem>
                          <SelectItem value="passport">
                            Surrender of Passport
                          </SelectItem>
                          <SelectItem value="custom">
                            Custom Conditions
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="customConditions">
                        Custom Bail Conditions (if any)
                      </Label>
                      <Textarea
                        id="customConditions"
                        placeholder="Enter any custom bail conditions"
                        value={formData.customConditions}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Generate */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Personal Details
                      </h3>
                      <div className="bg-muted p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Name:</span>{" "}
                            {formData.fullName}
                          </div>
                          <div>
                            <span className="font-medium">Age:</span>{" "}
                            {formData.age}
                          </div>
                          <div>
                            <span className="font-medium">Gender:</span>{" "}
                            {formData.gender}
                          </div>
                          <div>
                            <span className="font-medium">Occupation:</span>{" "}
                            {formData.occupation}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Address:</span>{" "}
                            {formData.address}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span>{" "}
                            {formData.phone}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span>{" "}
                            {formData.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Case Details</h3>
                      <div className="bg-muted p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">
                              FIR/Case Number:
                            </span>{" "}
                            {formData.firNumber}
                          </div>
                          <div>
                            <span className="font-medium">Police Station:</span>{" "}
                            {formData.policeStation}
                          </div>
                          <div>
                            <span className="font-medium">Court:</span>{" "}
                            {formData.court}
                          </div>
                          <div>
                            <span className="font-medium">Date of Arrest:</span>{" "}
                            {formData.arrestDate}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">
                              Sections Applied:
                            </span>{" "}
                            {formData.sections}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Allegations:</span>{" "}
                            {formData.allegations}
                          </div>
                          <div>
                            <span className="font-medium">Custody Status:</span>{" "}
                            {formData.custodyStatus}
                          </div>
                          <div>
                            <span className="font-medium">
                              Period in Custody:
                            </span>{" "}
                            {formData.custodyPeriod}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Grounds for Bail
                      </h3>
                      <div className="bg-muted p-4 rounded-md text-sm">
                        <p>{formData.bailGrounds}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-md">
                    <h3 className="text-primary font-medium mb-2">
                      Application Preview
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The application will be generated based on the information
                      provided above. You can review and edit the application
                      before downloading or printing.
                    </p>
                    <div className="flex mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Application
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={handleNextStep} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : currentStep < 4 ? (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Generate Application
                    <FileText className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Application Generated Successfully</CardTitle>
              <CardDescription>
                Your bail application has been generated and is ready for
                download or print
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="download">Download</TabsTrigger>
                  <TabsTrigger value="share">Share</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="preview"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-xl font-bold">
                        IN THE COURT OF{" "}
                        {formData.court?.toUpperCase() || "SESSIONS JUDGE"},
                        DELHI
                      </h2>
                      <p className="mt-2">
                        Bail Application No. _______ of{" "}
                        {new Date().getFullYear()}
                      </p>
                    </div>

                    <div>
                      <p>IN THE MATTER OF:</p>
                      <p className="font-medium mt-2">
                        {formData.fullName} s/o Sh. _______, aged {formData.age}{" "}
                        years,
                        <br />
                        r/o {formData.address}
                      </p>
                      <p className="text-right mt-2">...APPLICANT/ACCUSED</p>
                      <p className="mt-2">VERSUS</p>
                      <p className="font-medium mt-2">State (NCT of Delhi)</p>
                      <p className="text-right mt-2">...RESPONDENT</p>
                    </div>

                    <div>
                      <p className="font-medium text-center">
                        APPLICATION FOR REGULAR BAIL U/S 439 Cr.P.C.
                      </p>
                      <p className="mt-4">MOST RESPECTFULLY SHOWETH:</p>
                      <ol className="list-decimal pl-5 mt-2 space-y-2">
                        <li>
                          That the applicant/accused has been arrested in case
                          FIR No. {formData.firNumber}, PS{" "}
                          {formData.policeStation}, Delhi, under Sections{" "}
                          {formData.sections}.
                        </li>
                        <li>
                          That the applicant/accused is in{" "}
                          {formData.custodyStatus} custody since{" "}
                          {formData.arrestDate} ({formData.custodyPeriod}).
                        </li>
                        <li>{formData.bailGrounds}</li>
                      </ol>

                      <p className="mt-4">PRAYER:</p>
                      <p className="mt-2">
                        It is, therefore, most respectfully prayed that this
                        Hon'ble Court may be pleased to:
                      </p>
                      <ol className="list-decimal pl-5 mt-2 space-y-2">
                        <li>
                          Release the applicant/accused on regular bail on such
                          terms and conditions as this Hon'ble Court may deem
                          fit and proper.
                        </li>
                        <li>
                          Pass any other order which this Hon'ble Court may deem
                          fit and proper in the interest of justice.
                        </li>
                      </ol>

                      <div className="mt-6 flex justify-between">
                        <div>
                          <p>Place: Delhi</p>
                          <p>Date: {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p>THROUGH</p>
                          <p className="font-medium mt-2">
                            ADVOCATE FOR THE APPLICANT
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="download"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground">
                      Download your application in your preferred format
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="h-auto py-6 flex flex-col items-center gap-2"
                        onClick={() => handleDownloadApplication("PDF")}
                      >
                        <FileText className="h-8 w-8 text-primary" />
                        <span>Download as PDF</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-6 flex flex-col items-center gap-2"
                        onClick={() => handleDownloadApplication("DOCX")}
                      >
                        <FileText className="h-8 w-8 text-primary" />
                        <span>Download as DOCX</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-6 flex flex-col items-center gap-2"
                        onClick={() => window.print()}
                      >
                        <Printer className="h-8 w-8 text-primary" />
                        <span>Print Application</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="share"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground">
                      Share the application with colleagues or clients
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-share">Email Address</Label>
                        <div className="flex gap-2">
                          <Input
                            id="email-share"
                            placeholder="Enter email address"
                          />
                          <Button
                            onClick={() =>
                              handleShareApplication(
                                document.getElementById("email-share")?.value ||
                                  ""
                              )
                            }
                          >
                            Share
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link-share">Share Link</Label>
                        <div className="flex gap-2">
                          <Input
                            id="link-share"
                            value={`${window.location.origin}/application/share/${generatedApplicationId}`}
                            readOnly
                          />
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/application/share/${generatedApplicationId}`
                              );
                              addToast({
                                title: "Link Copied",
                                description:
                                  "Application link has been copied to clipboard",
                                type: "success",
                              });
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setApplicationGenerated(false)}
              >
                Edit Application
              </Button>
              <Button onClick={() => handleDownloadApplication("PDF")}>
                <Download className="mr-2 h-4 w-4" />
                Download Application
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
