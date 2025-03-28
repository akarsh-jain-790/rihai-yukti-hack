"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { FileText, Search, BookOpen, ArrowRight, Download, ExternalLink } from "lucide-react"
import DashboardLayout from "../components/layout/DashboardLayout"

interface LegalProvision {
  id: string
  code: string
  section: string
  title: string
  description: string
  punishment: string
  caseReferences: string[]
}

export default function LegalDatabase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvision, setSelectedProvision] = useState<LegalProvision | null>(null)

  // Sample data for legal provisions
  const legalProvisions: Record<string, LegalProvision[]> = {
    ipc: [
      {
        id: "ipc-302",
        code: "IPC",
        section: "302",
        title: "Punishment for murder",
        description:
          "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
        punishment: "Death or imprisonment for life, and fine",
        caseReferences: ["Bachan Singh v. State of Punjab (1980)", "Machhi Singh v. State of Punjab (1983)"],
      },
      {
        id: "ipc-376",
        code: "IPC",
        section: "376",
        title: "Punishment for rape",
        description:
          "Whoever commits rape shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.",
        punishment: "Rigorous imprisonment for 10 years to life, and fine",
        caseReferences: [
          "Mukesh & Anr. v. State (NCT of Delhi) & Ors. (2017)",
          "Tukaram v. State of Maharashtra (1979)",
        ],
      },
      {
        id: "ipc-420",
        code: "IPC",
        section: "420",
        title: "Cheating and dishonestly inducing delivery of property",
        description:
          "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        punishment: "Imprisonment up to 7 years, and fine",
        caseReferences: [
          "Hridaya Ranjan Prasad Verma v. State of Bihar (2000)",
          "Dr. S. Dutt v. State of Uttar Pradesh (1966)",
        ],
      },
    ],
    bns: [
      {
        id: "bns-103",
        code: "BNS",
        section: "103",
        title: "Punishment for murder",
        description:
          "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
        punishment: "Death or imprisonment for life, and fine",
        caseReferences: ["Equivalent to IPC Section 302"],
      },
      {
        id: "bns-65",
        code: "BNS",
        section: "65",
        title: "Punishment for sexual assault",
        description:
          "Whoever commits sexual assault shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.",
        punishment: "Rigorous imprisonment for 10 years to life, and fine",
        caseReferences: ["Equivalent to IPC Section 376"],
      },
      {
        id: "bns-318",
        code: "BNS",
        section: "318",
        title: "Cheating and dishonestly inducing delivery of property",
        description:
          "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        punishment: "Imprisonment up to 7 years, and fine",
        caseReferences: ["Equivalent to IPC Section 420"],
      },
    ],
    bss: [
      {
        id: "bss-174",
        code: "BSS",
        section: "174",
        title: "Non-attendance in obedience to an order from public servant",
        description:
          "Whoever, being legally bound to attend in person or by an agent at a certain place and time in obedience to a summons, notice, order, or proclamation proceeding from any public servant legally competent, as such public servant, to issue the same, intentionally omits to attend at that place or time, or departs from the place where he is bound to attend before the time at which it is lawful for him to depart, shall be punished with simple imprisonment for a term which may extend to one month, or with fine which may extend to five thousand rupees, or with both.",
        punishment: "Simple imprisonment up to 1 month, or fine up to ₹5,000, or both",
        caseReferences: ["Equivalent to CrPC Section 174"],
      },
      {
        id: "bss-41",
        code: "BSS",
        section: "41",
        title: "When police may arrest without warrant",
        description:
          "Any police officer may without an order from a Magistrate and without a warrant, arrest any person who has been concerned in any cognizable offence, or against whom a reasonable complaint has been made, or credible information has been received, or a reasonable suspicion exists, of his having been so concerned.",
        punishment: "Procedural provision, no punishment specified",
        caseReferences: ["Equivalent to CrPC Section 41"],
      },
    ],
    bsa: [
      {
        id: "bsa-3",
        code: "BSA",
        section: "3",
        title: "Interpretation of 'Court', 'Fact', 'Evidence'",
        description:
          "In this Act the following words and expressions are used in the following senses, unless a contrary intention appears from the context: 'Court' includes all Judges and Magistrates, and all persons, except arbitrators, legally authorized to take evidence. 'Fact' means and includes any thing, state of things, or relation of things, capable of being perceived by the senses. 'Evidence' means and includes statements which the Court permits or requires to be made before it by witnesses, in relation to matters of fact under inquiry.",
        punishment: "Definitional provision, no punishment specified",
        caseReferences: ["Equivalent to Indian Evidence Act Section 3"],
      },
      {
        id: "bsa-118",
        code: "BSA",
        section: "118",
        title: "Who may testify",
        description:
          "All persons shall be competent to testify unless the Court considers that they are prevented from understanding the questions put to them, or from giving rational answers to those questions, by tender years, extreme old age, disease, whether of body or mind, or any other cause of the same kind.",
        punishment: "Procedural provision, no punishment specified",
        caseReferences: ["Equivalent to Indian Evidence Act Section 118"],
      },
    ],
  }

  const filteredProvisions = Object.values(legalProvisions)
    .flat()
    .filter(
      (provision) =>
        provision.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provision.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Legal Database</h1>
          <p className="text-muted-foreground">Access legal provisions, offenses, and judicial pronouncements</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by section number, title, or keywords..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Legal Codes */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="ipc">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="ipc">IPC</TabsTrigger>
                <TabsTrigger value="bns">BNS</TabsTrigger>
                <TabsTrigger value="bss">BSS</TabsTrigger>
                <TabsTrigger value="bsa">BSA</TabsTrigger>
              </TabsList>

              {Object.entries(legalProvisions).map(([code, provisions]) => (
                <TabsContent key={code} value={code} className="space-y-4">
                  {provisions.map((provision) => (
                    <Card
                      key={provision.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedProvision(provision)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {provision.code} {provision.section}: {provision.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                              {provision.description.substring(0, 100)}...
                            </CardDescription>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Provision Details */}
          <div className="lg:col-span-2">
            {selectedProvision ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        {selectedProvision.code} Section {selectedProvision.section}
                      </div>
                      <CardTitle>{selectedProvision.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedProvision.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Punishment</h3>
                    <p className="text-muted-foreground">{selectedProvision.punishment}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Case References</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedProvision.caseReferences.map((caseRef, index) => (
                        <li key={index} className="text-muted-foreground">
                          <span className="text-primary cursor-pointer hover:underline">{caseRef}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-2">Related Provisions</h3>
                    <div className="flex flex-wrap gap-2">
                      {legalProvisions[selectedProvision.code.toLowerCase()]
                        .filter((p) => p.id !== selectedProvision.id)
                        .slice(0, 3)
                        .map((provision) => (
                          <Button
                            key={provision.id}
                            variant="outline"
                            className="text-sm"
                            onClick={() => setSelectedProvision(provision)}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            {provision.code} {provision.section}
                          </Button>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="pt-10 pb-10 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Legal Provision</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Choose a provision from the list on the left to view detailed information, including description,
                    punishment, and case references.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            {filteredProvisions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProvisions.map((provision) => (
                  <Card
                    key={provision.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedProvision(provision)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            {provision.code} Section {provision.section}
                          </div>
                          <CardTitle className="text-base">{provision.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {provision.description.substring(0, 80)}...
                          </CardDescription>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

