"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { FileText, Download, Printer, Eye, CheckCircle, ArrowRight } from "lucide-react"
import DashboardLayout from "../components/layout/DashboardLayout"

export default function ApplicationGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [applicationGenerated, setApplicationGenerated] = useState(false)

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      setApplicationGenerated(true)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bail Application Generator</h1>
          <p className="text-muted-foreground">Generate compliant bail applications with just a few clicks</p>
        </div>

        {/* Progress Steps */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                    step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    step <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
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
                {currentStep === 2 && "Enter details about the case and charges"}
                {currentStep === 3 && "Specify grounds for seeking bail"}
                {currentStep === 4 && "Review all information before generating the application"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" placeholder="Enter age" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select>
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
                      <Input id="occupation" placeholder="Enter occupation" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Residential Address</Label>
                      <Textarea id="address" placeholder="Enter complete address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Case Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fir-number">FIR/Case Number</Label>
                      <Input id="fir-number" placeholder="Enter FIR/Case number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="police-station">Police Station</Label>
                      <Input id="police-station" placeholder="Enter police station" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="court">Court</Label>
                      <Select>
                        <SelectTrigger id="court">
                          <SelectValue placeholder="Select court" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sessions">Sessions Court</SelectItem>
                          <SelectItem value="high">High Court</SelectItem>
                          <SelectItem value="magistrate">Magistrate Court</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="arrest-date">Date of Arrest</Label>
                      <Input id="arrest-date" type="date" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="sections">Sections Applied</Label>
                      <Input id="sections" placeholder="e.g., BNS 103, 109, 115" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="allegations">Brief Description of Allegations</Label>
                      <Textarea id="allegations" placeholder="Describe the allegations briefly" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custody-status">Custody Status</Label>
                      <Select>
                        <SelectTrigger id="custody-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="police">Police Custody</SelectItem>
                          <SelectItem value="judicial">Judicial Custody</SelectItem>
                          <SelectItem value="not-arrested">Not Yet Arrested</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custody-period">Period in Custody</Label>
                      <Input id="custody-period" placeholder="e.g., 30 days" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Grounds for Bail */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bail-grounds">Grounds for Bail</Label>
                    <Textarea
                      id="bail-grounds"
                      placeholder="Enter grounds for bail application"
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Suggested Grounds for Bail</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>The accused has no prior criminal record and is a first-time offender.</li>
                      <li>The accused has strong roots in the community and is not a flight risk.</li>
                      <li>The investigation is complete, and custody is no longer required.</li>
                      <li>The accused has been in custody for a substantial period (mention specific time).</li>
                      <li>The alleged offense is bailable in nature.</li>
                      <li>
                        The accused is eligible for bail under Section 436A of CrPC having served half the maximum
                        sentence.
                      </li>
                      <li>The accused is the sole breadwinner of the family.</li>
                      <li>The accused requires medical attention that cannot be provided in custody.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="previous-bail">Previous Bail Applications</Label>
                      <Select>
                        <SelectTrigger id="previous-bail">
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
                      <Label htmlFor="bail-conditions">Proposed Bail Conditions</Label>
                      <Select>
                        <SelectTrigger id="bail-conditions">
                          <SelectValue placeholder="Select conditions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Conditions</SelectItem>
                          <SelectItem value="reporting">Regular Reporting to Police</SelectItem>
                          <SelectItem value="passport">Surrender of Passport</SelectItem>
                          <SelectItem value="custom">Custom Conditions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="custom-conditions">Custom Bail Conditions (if any)</Label>
                      <Textarea id="custom-conditions" placeholder="Enter any custom bail conditions" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Generate */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Personal Details</h3>
                      <div className="bg-muted p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Name:</span> Rahul Kumar
                          </div>
                          <div>
                            <span className="font-medium">Age:</span> 32
                          </div>
                          <div>
                            <span className="font-medium">Gender:</span> Male
                          </div>
                          <div>
                            <span className="font-medium">Occupation:</span> Teacher
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Address:</span> 123, ABC Colony, New Delhi - 110001
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> +91 9876543210
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> rahul.kumar@example.com
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Case Details</h3>
                      <div className="bg-muted p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">FIR/Case Number:</span> 123/2023
                          </div>
                          <div>
                            <span className="font-medium">Police Station:</span> Connaught Place
                          </div>
                          <div>
                            <span className="font-medium">Court:</span> Sessions Court, Delhi
                          </div>
                          <div>
                            <span className="font-medium">Date of Arrest:</span> 15/01/2023
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Sections Applied:</span> BNS 318, 320
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Allegations:</span> Accused of cheating and dishonestly
                            inducing delivery of property worth Rs. 5 lakhs.
                          </div>
                          <div>
                            <span className="font-medium">Custody Status:</span> Judicial Custody
                          </div>
                          <div>
                            <span className="font-medium">Period in Custody:</span> 60 days
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Grounds for Bail</h3>
                      <div className="bg-muted p-4 rounded-md text-sm">
                        <p>1. The accused has no prior criminal record and is a first-time offender.</p>
                        <p>2. The accused has strong roots in the community and is not a flight risk.</p>
                        <p>3. The investigation is complete, and custody is no longer required.</p>
                        <p>4. The accused has been in custody for 60 days, which is a substantial period.</p>
                        <p>
                          5. The accused is the sole breadwinner of the family with two dependent children and elderly
                          parents.
                        </p>
                        <p>6. The accused is willing to abide by any conditions imposed by the Hon'ble Court.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-md">
                    <h3 className="text-primary font-medium mb-2">Application Preview</h3>
                    <p className="text-sm text-muted-foreground">
                      The application will be generated based on the information provided above. You can review and edit
                      the application before downloading or printing.
                    </p>
                    <div className="flex mt-2">
                      <Button variant="outline" size="sm" className="text-primary">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Application
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                {currentStep < 4 ? (
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
                Your bail application has been generated and is ready for download or print
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="download">Download</TabsTrigger>
                  <TabsTrigger value="share">Share</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="p-4 border rounded-md mt-4">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-xl font-bold">IN THE COURT OF SESSIONS JUDGE, DELHI</h2>
                      <p className="mt-2">Bail Application No. _______ of 2023</p>
                    </div>

                    <div>
                      <p>IN THE MATTER OF:</p>
                      <p className="font-medium mt-2">
                        Rahul Kumar s/o Sh. _______, aged 32 years,
                        <br />
                        r/o 123, ABC Colony, New Delhi - 110001
                      </p>
                      <p className="text-right mt-2">...APPLICANT/ACCUSED</p>
                      <p className="mt-2">VERSUS</p>
                      <p className="font-medium mt-2">State (NCT of Delhi)</p>
                      <p className="text-right mt-2">...RESPONDENT</p>
                    </div>

                    <div>
                      <p className="font-medium text-center">APPLICATION FOR REGULAR BAIL U/S 439 Cr.P.C.</p>
                      <p className="mt-4">MOST RESPECTFULLY SHOWETH:</p>
                      <ol className="list-decimal pl-5 mt-2 space-y-2">
                        <li>
                          That the applicant/accused has been arrested in case FIR No. 123/2023, PS Connaught Place,
                          Delhi, under Sections 318, 320 of BNS.
                        </li>
                        <li>That the applicant/accused is in judicial custody since 15/01/2023 (60 days).</li>
                        <li>That the applicant/accused has no prior criminal record and is a first-time offender.</li>
                        <li>That the applicant/accused has strong roots in the community and is not a flight risk.</li>
                        <li>That the investigation is complete, and custody is no longer required.</li>
                        <li>
                          That the applicant/accused is the sole breadwinner of the family with two dependent children
                          and elderly parents.
                        </li>
                        <li>
                          That the applicant/accused is willing to abide by any conditions imposed by the Hon'ble Court.
                        </li>
                        <li>
                          That the applicant/accused undertakes to appear before the court on all dates of hearing and
                          will not tamper with evidence or influence witnesses.
                        </li>
                        <li>
                          That the applicant/accused is entitled to bail in accordance with the provisions of Section
                          436A of CrPC, having served a substantial period in custody.
                        </li>
                      </ol>

                      <p className="mt-4">PRAYER:</p>
                      <p className="mt-2">
                        It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:
                      </p>
                      <ol className="list-decimal pl-5 mt-2 space-y-2">
                        <li>
                          Release the applicant/accused on regular bail on such terms and conditions as this Hon'ble
                          Court may deem fit and proper.
                        </li>
                        <li>
                          Pass any other order which this Hon'ble Court may deem fit and proper in the interest of
                          justice.
                        </li>
                      </ol>

                      <div className="mt-6 flex justify-between">
                        <div>
                          <p>Place: Delhi</p>
                          <p>Date: {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p>THROUGH</p>
                          <p className="font-medium mt-2">ADVOCATE FOR THE APPLICANT</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="download" className="p-4 border rounded-md mt-4">
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground">
                      Download your application in your preferred format
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-primary" />
                        <span>Download as PDF</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-primary" />
                        <span>Download as DOCX</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                        <Printer className="h-8 w-8 text-primary" />
                        <span>Print Application</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="share" className="p-4 border rounded-md mt-4">
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground">
                      Share the application with colleagues or clients
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-share">Email Address</Label>
                        <div className="flex gap-2">
                          <Input id="email-share" placeholder="Enter email address" />
                          <Button>Share</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link-share">Share Link</Label>
                        <div className="flex gap-2">
                          <Input id="link-share" value="https://rihai-yukti.com/app/share/123456" readOnly />
                          <Button variant="outline">Copy</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setApplicationGenerated(false)}>
                Edit Application
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Application
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

