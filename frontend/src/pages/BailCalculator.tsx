"use client";

import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Alert } from "../components/ui/alert";
import { FileText, Info, AlertTriangle, CheckCircle } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function BailCalculator() {
  const [calculationResult, setCalculationResult] = useState<null | {
    eligible: boolean;
    reason: string;
    recommendation: string;
    eligibilityScore: number;
  }>(null);

  const [formData, setFormData] = useState({
    offenseType: "",
    section: "",
    maxSentence: "",
    timeServed: "",
    pendingCases: "",
    previousConvictions: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    // Simple calculation logic
    const maxSentence = Number.parseFloat(formData.maxSentence) || 0;
    const timeServed = Number.parseFloat(formData.timeServed) || 0;
    const hasPendingCases = formData.pendingCases === "multiple";
    const hasPreviousConvictions = formData.previousConvictions !== "none";

    // Calculate eligibility based on CrPC Section 436A (half of max sentence)
    const halfMaxSentence = maxSentence / 2;
    const isEligible = timeServed >= halfMaxSentence && !hasPendingCases;

    // Calculate score (0-100)
    let score = (timeServed / maxSentence) * 100;
    if (hasPendingCases) score -= 30;
    if (hasPreviousConvictions) score -= 20;
    score = Math.max(0, Math.min(100, score));

    setCalculationResult({
      eligible: isEligible,
      reason: isEligible
        ? `Based on CrPC provisions, the accused has served more than half of the maximum sentence (${timeServed} years out of ${maxSentence} years) for the offense.`
        : hasPendingCases
        ? "The accused has multiple pending cases, which makes them ineligible for bail under Section 436A of CrPC."
        : `The accused has not served half of the maximum sentence (${timeServed} years out of required ${halfMaxSentence} years).`,
      recommendation: isEligible
        ? "The accused is eligible for bail under Section 436A of CrPC."
        : "The accused is not eligible for bail under Section 436A of CrPC at this time.",
      eligibilityScore: Math.round(score),
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bail Eligibility Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate bail eligibility based on legal provisions
          </p>
        </div>

        <Tabs defaultValue="crpc" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crpc">CrPC Provisions</TabsTrigger>
            <TabsTrigger value="bnss">BNSS Provisions</TabsTrigger>
          </TabsList>

          <TabsContent value="crpc">
            <Card>
              <CardHeader>
                <CardTitle>CrPC Bail Eligibility</CardTitle>
                <CardDescription>
                  Calculate bail eligibility based on Code of Criminal Procedure
                  provisions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="offense-type">Offense Type</Label>
                    <select
                      onChange={(value) => handleChange("offenseType", value)}
                    >
                      <option placeholder="Select offense type" />
                      <option value="bailable">Bailable Offense</option>
                      <option value="non-bailable">Non-Bailable Offense</option>
                      <option value="economic">Economic Offense</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipc-section">IPC Section</Label>
                    <Select
                      onValueChange={(value) => handleChange("section", value)}
                    >
                      <SelectTrigger id="ipc-section">
                        <SelectValue placeholder="Select IPC section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="section-302">
                          Section 302 - Murder
                        </SelectItem>
                        <SelectItem value="section-376">
                          Section 376 - Rape
                        </SelectItem>
                        <SelectItem value="section-420">
                          Section 420 - Cheating
                        </SelectItem>
                        <SelectItem value="section-307">
                          Section 307 - Attempt to Murder
                        </SelectItem>
                        <SelectItem value="section-326">
                          Section 326 - Voluntarily causing grievous hurt
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-sentence">
                      Maximum Sentence (Years)
                    </Label>
                    <Input
                      id="max-sentence"
                      type="number"
                      placeholder="Enter maximum sentence"
                      value={formData.maxSentence}
                      onChange={(e) =>
                        handleChange("maxSentence", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time-served">
                      Time Already Served (Years)
                    </Label>
                    <Input
                      id="time-served"
                      type="number"
                      placeholder="Enter time served"
                      value={formData.timeServed}
                      onChange={(e) =>
                        handleChange("timeServed", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pending-cases">Pending Cases</Label>
                    <Select
                      onValueChange={(value) =>
                        handleChange("pendingCases", value)
                      }
                    >
                      <SelectTrigger id="pending-cases">
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
                    <Label htmlFor="previous-convictions">
                      Previous Convictions
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleChange("previousConvictions", value)
                      }
                    >
                      <SelectTrigger id="previous-convictions">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="one">One</SelectItem>
                        <SelectItem value="multiple">Multiple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        CrPC Bail Eligibility Criteria
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Under Section 436A of CrPC, an undertrial prisoner is
                        eligible for bail after serving half of the maximum
                        sentence, except for offenses punishable with death or
                        life imprisonment, or if there are multiple pending
                        cases.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCalculate} className="w-full">
                  Calculate Eligibility
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="bnss">
            <Card>
              <CardHeader>
                <CardTitle>BNSS Bail Eligibility</CardTitle>
                <CardDescription>
                  Calculate bail eligibility based on Bhartiya Nyaya Sanhita
                  provisions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="offense-type-bnss">Offense Type</Label>
                    <Select>
                      <SelectTrigger id="offense-type-bnss">
                        <SelectValue placeholder="Select offense type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bailable">
                          Bailable Offense
                        </SelectItem>
                        <SelectItem value="non-bailable">
                          Non-Bailable Offense
                        </SelectItem>
                        <SelectItem value="economic">
                          Economic Offense
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bns-section">BNS Section</Label>
                    <Select>
                      <SelectTrigger id="bns-section">
                        <SelectValue placeholder="Select BNS section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="section-103">
                          Section 103 - Murder
                        </SelectItem>
                        <SelectItem value="section-65">
                          Section 65 - Sexual Assault
                        </SelectItem>
                        <SelectItem value="section-318">
                          Section 318 - Cheating
                        </SelectItem>
                        <SelectItem value="section-109">
                          Section 109 - Attempt to Murder
                        </SelectItem>
                        <SelectItem value="section-115">
                          Section 115 - Grievous Hurt
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-sentence-bnss">
                      Maximum Sentence (Years)
                    </Label>
                    <Input
                      id="max-sentence-bnss"
                      type="number"
                      placeholder="Enter maximum sentence"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time-served-bnss">
                      Time Already Served (Years)
                    </Label>
                    <Input
                      id="time-served-bnss"
                      type="number"
                      placeholder="Enter time served"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pending-cases-bnss">Pending Cases</Label>
                    <Select>
                      <SelectTrigger id="pending-cases-bnss">
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
                    <Label htmlFor="previous-convictions-bnss">
                      Previous Convictions
                    </Label>
                    <Select>
                      <SelectTrigger id="previous-convictions-bnss">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="one">One</SelectItem>
                        <SelectItem value="multiple">Multiple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        BNSS Bail Eligibility Criteria
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Under BNSS provisions, an undertrial prisoner is
                        eligible for bail after serving one-third of the maximum
                        sentence, except for offenses punishable with life
                        imprisonment, or if there are multiple pending charges
                        or cases.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCalculate} className="w-full">
                  Calculate Eligibility
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {calculationResult && (
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Result</CardTitle>
              <CardDescription>
                Based on the information provided
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {calculationResult.eligible ? (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <div className="ml-3">
                    <h5 className="text-green-700 dark:text-green-300 font-medium">
                      Eligible for Bail
                    </h5>
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      {calculationResult.reason}
                    </p>
                  </div>
                </Alert>
              ) : (
                <Alert className="border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  <div className="ml-3">
                    <h5 className="text-red-700 dark:text-red-300 font-medium">
                      Not Eligible for Bail
                    </h5>
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {calculationResult.reason}
                    </p>
                  </div>
                </Alert>
              )}

              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-2">Recommendation</h3>
                <p className="text-muted-foreground">
                  {calculationResult.recommendation}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Eligibility Score</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${calculationResult.eligibilityScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">0%</span>
                  <span className="text-xs font-medium">
                    {calculationResult.eligibilityScore}%
                  </span>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Proceed to Application
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
