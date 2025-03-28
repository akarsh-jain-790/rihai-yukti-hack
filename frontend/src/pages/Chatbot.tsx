"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { MessageSquare, Send, User, Bot, FileText, ArrowRight, Paperclip } from "lucide-react"
import DashboardLayout from "../components/layout/DashboardLayout"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm the BNS Chatbot. How can I assist you with bail-related queries today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        "bail eligibility":
          "Under Section 436A of CrPC, an undertrial prisoner is eligible for bail after serving half of the maximum sentence, except for offenses punishable with death or life imprisonment, or if there are multiple pending cases. Under BNSS provisions, this has been reduced to one-third of the maximum sentence.",
        "bail application":
          "A bail application should include details of the accused, case information, grounds for bail, previous bail history, and undertakings. The application should be filed in the court with appropriate jurisdiction.",
        "bail conditions":
          "Common bail conditions include regular attendance at the police station, surrender of passport, restrictions on travel, and providing surety. The court may impose additional conditions based on the nature of the offense and flight risk.",
        "bail bond":
          "A bail bond is a written promise signed by the accused and surety to ensure that the accused will appear in court when required. The amount of the bond is determined by the court based on various factors.",
        "anticipatory bail":
          "Anticipatory bail is granted under Section 438 of CrPC. It allows a person to seek bail in anticipation of arrest on accusation of having committed a non-bailable offense.",
        "regular bail":
          "Regular bail is granted to a person who is already in custody. It can be applied for under Section 437 and 439 of CrPC depending on the court's jurisdiction.",
        default:
          "I don't have specific information about that. Would you like to know about bail eligibility, bail application process, bail conditions, bail bonds, anticipatory bail, or regular bail?",
      }

      // Generate bot response based on user query
      let botResponse = botResponses.default
      const userQuery = userMessage.content.toLowerCase()

      for (const [keyword, response] of Object.entries(botResponses)) {
        if (userQuery.includes(keyword)) {
          botResponse = response
          break
        }
      }

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newBotMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Sample suggested queries
  const suggestedQueries = [
    "What are the eligibility criteria for bail?",
    "How do I apply for bail?",
    "What conditions can be imposed on bail?",
    "What is anticipatory bail?",
    "What documents are needed for bail application?",
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">BNS Chatbot</h1>
            <p className="text-muted-foreground">Get instant assistance with bail-related queries</p>
          </div>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View Chat History
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          {/* Chat Window */}
          <Card className="lg:col-span-3 flex flex-col">
            <CardHeader className="border-b px-4 py-3">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/bot-avatar.png" />
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">BNS Chatbot</CardTitle>
                  <CardDescription className="text-xs">Online</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"}`}>
                        {message.sender === "user" ? (
                          <>
                            <AvatarImage src="/user-avatar.png" />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/bot-avatar.png" />
                            <AvatarFallback>
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                        <div
                          className={`text-xs text-muted-foreground mt-1 ${
                            message.sender === "user" ? "text-right" : ""
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-3">
              <div className="flex w-full items-center space-x-2">
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Suggested Queries */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suggested Queries</CardTitle>
                <CardDescription>Click on any query to ask the chatbot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInputValue(query)
                      // Optional: automatically send the query
                      // setInputValue(query);
                      // setTimeout(() => handleSendMessage(), 100);
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{query}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Legal Resources</CardTitle>
                <CardDescription>Helpful resources for bail-related information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-between text-left h-auto py-2">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>CrPC Section 436A</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between text-left h-auto py-2">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>BNSS Bail Provisions</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between text-left h-auto py-2">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Bail Application Template</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

