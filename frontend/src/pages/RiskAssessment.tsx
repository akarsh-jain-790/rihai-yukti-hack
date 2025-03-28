"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Slider } from "../components/ui/slider"
import { Alert } from "../components/ui/alert"
import { FileText, AlertTriangle, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Info } from "lucide-react"
import DashboardLayout from "../components/layout/DashboardLayout"
import { motion, AnimatePresence } from "framer-motion"

export default function RiskAssessment() {
  const [riskResult, setRiskResult] = useState<null | {
    score: number
    level: "Low" | "Medium" | "High"
    factors: {
      name: string
      score: number
      weight: number
      weightedScore: number
    }[]
    recommendation: string
  }>(null)

  const [formData, setFormData] = useState({
    criminalHistory: "low",
    flightRisk: "low",
    severityOfCharges: "medium",
    socialEconomic: "low",
    weights: {
      criminalHistory: 30,
      flightRisk: 25,
      severityOfCharges: 30,
      socialEconomic: 15,
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showFactorDetails, setShowFactorDetails] = useState(false)

  const handleRadioChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleWeightChange = (field: string, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      weights: {
        ...prev.weights,
        [field]: value[0],
      },
    }))
  }

  const handleAssessRisk = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Calculate risk score based on form data
      const getScoreValue = (level: string) => {
        switch (level) {
          case "low":
            return 1
          case "medium":
            return 2
          case "high":
            return 3
          default:
            return 1
        }
      }

      const factors = [
        {
          name: "Criminal History",
          score: getScoreValue(formData.criminalHistory),
          weight: formData.weights.criminalHistory / 100,
          weightedScore: (getScoreValue(formData.criminalHistory) * formData.weights.criminalHistory) / 100,
        },
        {
          name: "Flight Risk",
          score: getScoreValue(formData.flightRisk),
          weight: formData.weights.flightRisk / 100,
          weightedScore: (getScoreValue(formData.flightRisk) * formData.weights.flightRisk) / 100,
        },
        {
          name: "Severity of Charges",
          score: getScoreValue(formData.severityOfCharges),
          weight: formData.weights.severityOfCharges / 100,
          weightedScore: (getScoreValue(formData.severityOfCharges) * formData.weights.severityOfCharges) / 100,
        },
        {
          name: "Social/Economic Background",
          score: getScoreValue(formData.socialEconomic),
          weight: formData.weights.socialEconomic / 100,
          weightedScore: (getScoreValue(formData.socialEconomic) * formData.weights.socialEconomic) / 100,
        },
      ]

      const totalScore = factors.reduce((sum, factor) => sum + factor.weightedScore, 0)

      let riskLevel: "Low" | "Medium" | "High"
      if (totalScore < 1.5) {
        riskLevel = "Low"
      } else if (totalScore < 2.5) {
        riskLevel = "Medium"
      } else {
        riskLevel = "High"
      }

      let recommendation = ""
      switch (riskLevel) {
        case "Low":
          recommendation =
            "The accused presents a low risk level. Consider granting bail with standard conditions such as regular reporting to the police station."
          break
        case "Medium":
          recommendation =
            "The accused presents a medium risk level. Consider imposing conditions such as regular reporting to the police station, surrender of passport, and a substantial surety bond."
          break
        case "High":
          recommendation =
            "The accused presents a high risk level. Bail may not be recommended due to significant flight risk, severity of charges, and/or criminal history. If bail is considered, strict conditions should be imposed."
          break
      }

      setRiskResult({
        score: totalScore,
        level: riskLevel,
        factors,
        recommendation,
      })

      setIsLoading(false)
    }, 1500)
  }

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      setRiskResult(null)
      setFormData({
        criminalHistory: "low",
        flightRisk: "low",
        severityOfCharges: "medium",
        socialEconomic: "low",
        weights: {
          criminalHistory: 30,
          flightRisk: 25,
          severityOfCharges: 30,
          socialEconomic: 15,
        },
      })
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold tracking-tight">Risk Assessment</h1>
          <p className="text-muted-foreground">Evaluate risk factors for bail decisions</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Form</CardTitle>
                <CardDescription>
                  Evaluate risk factors based on criminal history, flight risk, severity of charges, and social/economic
                  background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Criminal History */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Criminal History</h3>
                  <RadioGroup
                    value={formData.criminalHistory}
                    onValueChange={(value) => handleRadioChange("criminalHistory", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="criminal-low" />
                      <Label htmlFor="criminal-low">Low (1) - No prior criminal record</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="criminal-medium" />
                      <Label htmlFor="criminal-medium">
                        Medium (2) - Minor prior offenses or single non-violent felony
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="criminal-high" />
                      <Label htmlFor="criminal-high">
                        High (3) - Multiple prior offenses or violent criminal history
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Flight Risk */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Flight Risk</h3>
                  <RadioGroup
                    value={formData.flightRisk}
                    onValueChange={(value) => handleRadioChange("flightRisk", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="flight-low" />
                      <Label htmlFor="flight-low">Low (1) - Strong community ties, stable residence, employment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="flight-medium" />
                      <Label htmlFor="flight-medium">
                        Medium (2) - Moderate community ties, some stability concerns
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="flight-high" />
                      <Label htmlFor="flight-high">
                        High (3) - Weak community ties, history of failure to appear, foreign connections
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Severity of Charges */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Severity of Charges</h3>
                  <RadioGroup
                    value={formData.severityOfCharges}
                    onValueChange={(value) => handleRadioChange("severityOfCharges", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="severity-low" />
                      <Label htmlFor="severity-low">Low (1) - Minor offenses, non-violent crimes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="severity-medium" />
                      <Label htmlFor="severity-medium">Medium (2) - Moderate offenses, property crimes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="severity-high" />
                      <Label htmlFor="severity-high">
                        High (3) - Serious offenses, violent crimes, organized crime
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Social/Economic Background */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Social/Economic Background</h3>
                  <RadioGroup
                    value={formData.socialEconomic}
                    onValueChange={(value) => handleRadioChange("socialEconomic", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="social-low" />
                      <Label htmlFor="social-low">
                        Low (1) - Stable employment, family support, financial stability
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="social-medium" />
                      <Label htmlFor="social-medium">
                        Medium (2) - Inconsistent employment, limited support system
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="social-high" />
                      <Label htmlFor="social-high">
                        High (3) - Unemployment, lack of support system, financial instability
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Factor Weights */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Factor Weights</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFactorDetails(!showFactorDetails)}
                      className="flex items-center gap-1"
                    >
                      {showFactorDetails ? "Hide Details" : "Show Details"}
                      {showFactorDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showFactorDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-muted p-3 rounded-md mb-3">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-primary mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                              Adjust the importance of each factor in the overall risk assessment. The total weight must
                              equal 100%.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="criminal-weight">Criminal History</Label>
                        <span className="text-sm">{formData.weights.criminalHistory}%</span>
                      </div>
                      <Slider
                        id="criminal-weight"
                        value={[formData.weights.criminalHistory]}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleWeightChange("criminalHistory", value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="flight-weight">Flight Risk</Label>
                        <span className="text-sm">{formData.weights.flightRisk}%</span>
                      </div>
                      <Slider
                        id="flight-weight"
                        value={[formData.weights.flightRisk]}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleWeightChange("flightRisk", value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="severity-weight">Severity of Charges</Label>
                        <span className="text-sm">{formData.weights.severityOfCharges}%</span>
                      </div>
                      <Slider
                        id="severity-weight"
                        value={[formData.weights.severityOfCharges]}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleWeightChange("severityOfCharges", value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="social-weight">Social/Economic Background</Label>
                        <span className="text-sm">{formData.weights.socialEconomic}%</span>
                      </div>
                      <Slider
                        id="social-weight"
                        value={[formData.weights.socialEconomic]}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleWeightChange("socialEconomic", value)}
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium">Total Weight:</span>
                      <span
                        className={`text-sm font-medium ${
                          Object.values(formData.weights).reduce((a, b) => a + b, 0) === 100
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {Object.values(formData.weights).reduce((a, b) => a + b, 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleAssessRisk}
                  className="w-full"
                  disabled={isLoading || Object.values(formData.weights).reduce((a, b) => a + b, 0) !== 100}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Assessing Risk...
                    </>
                  ) : (
                    "Assess Risk"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {riskResult ? (
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment Result</CardTitle>
                  <CardDescription>Based on the information provided</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Risk Level Alert */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={riskResult.level}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {riskResult.level === "Low" && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                            <div>
                              <h5 className="text-green-700 dark:text-green-300 font-medium">Low Risk Level</h5>
                              <p className="text-green-600 dark:text-green-400 text-sm">
                                The accused presents a low risk level with a score of {riskResult.score.toFixed(1)}.
                              </p>
                            </div>
                          </div>
                        </Alert>
                      )}

                      {riskResult.level === "Medium" && (
                        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3" />
                            <div>
                              <h5 className="text-yellow-700 dark:text-yellow-300 font-medium">Medium Risk Level</h5>
                              <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                                The accused presents a medium risk level with a score of {riskResult.score.toFixed(1)}.
                              </p>
                            </div>
                          </div>
                        </Alert>
                      )}

                      {riskResult.level === "High" && (
                        <Alert className="border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-800">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" />
                            <div>
                              <h5 className="text-red-700 dark:text-red-300 font-medium">High Risk Level</h5>
                              <p className="text-red-600 dark:text-red-400 text-sm">
                                The accused presents a high risk level with a score of {riskResult.score.toFixed(1)}.
                              </p>
                            </div>
                          </div>
                        </Alert>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Risk Factors Breakdown */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Risk Factors Breakdown</h3>
                    <div className="space-y-4">
                      {riskResult.factors.map((factor, index) => (
                        <motion.div
                          key={factor.name}
                          className="space-y-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{factor.name}</span>
                            <span className="text-sm">
                              Score: {factor.score} × Weight: {(factor.weight * 100).toFixed(0)}% ={" "}
                              {factor.weightedScore.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full ${
                                factor.score === 1
                                  ? "bg-green-500"
                                  : factor.score === 2
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: "0%" }}
                              animate={{ width: `${(factor.score / 3) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Overall Risk Score */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Overall Risk Score</h3>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <motion.div
                        className={`h-4 rounded-full ${
                          riskResult.score < 1.5
                            ? "bg-green-500"
                            : riskResult.score < 2.5
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: "0%" }}
                        animate={{ width: `${(riskResult.score / 3) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Low Risk (1.0)</span>
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                        Medium Risk (2.0)
                      </span>
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">High Risk (3.0)</span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <motion.div
                    className="p-4 border rounded-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <h3 className="text-lg font-medium mb-2">Recommendation</h3>
                    <p className="text-muted-foreground">{riskResult.recommendation}</p>
                  </motion.div>
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
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="pt-10 pb-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-8 w-8 text-primary" />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-medium mb-2">Risk Assessment Results</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Complete the risk assessment form on the left and click "Assess Risk" to generate a comprehensive
                    risk analysis.
                  </p>
                  <div className="mt-6">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Low Risk</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Medium Risk</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">High Risk</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Risk Assessment Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Guide</CardTitle>
              <CardDescription>Understanding the risk assessment methodology and interpretation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Low Risk (1.0-1.5)</h3>
                  <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                    <ul className="list-disc pl-5 space-y-1 text-sm text-green-800 dark:text-green-300">
                      <li>No prior criminal record</li>
                      <li>Strong community ties</li>
                      <li>Stable employment and residence</li>
                      <li>Minor, non-violent offense</li>
                      <li>Likely to appear for court dates</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Medium Risk (1.6-2.5)</h3>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
                      <li>Some prior offenses</li>
                      <li>Moderate community ties</li>
                      <li>Some stability concerns</li>
                      <li>Moderate offense severity</li>
                      <li>May require additional conditions</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">High Risk (2.6-3.0)</h3>
                  <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                    <ul className="list-disc pl-5 space-y-1 text-sm text-red-800 dark:text-red-300">
                      <li>Extensive criminal history</li>
                      <li>Weak community ties</li>
                      <li>Unstable living situation</li>
                      <li>Serious or violent offense</li>
                      <li>High flight risk</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-md">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-base font-medium mb-1">Important Note</h4>
                    <p className="text-sm text-muted-foreground">
                      This risk assessment tool is designed to assist legal professionals in making informed decisions
                      about bail applications. It should be used as one of many factors in the decision-making process
                      and not as the sole determinant. Each case should be evaluated on its individual merits, taking
                      into account all relevant circumstances.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

