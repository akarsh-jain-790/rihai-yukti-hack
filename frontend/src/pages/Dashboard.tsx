"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar, FileText, MessageSquare, PieChart } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { caseService } from "../services/api";
// import { hearingService } from "../services/api";
import { useToast } from "../components/ui/toaster";

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCases() {
      try {
        const [allCases] = await Promise.all([caseService.getAllCases()]); // Fetch all cases
        setCases(allCases);
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to fetch cases",
          type: "error",
        });
        console.error("Error fetching cases:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCases();
  }, []);

  console.log("Cases:", cases);

  const totalCases = isLoading ? [] : cases; // All cases
  const pendingCases = isLoading
    ? []
    : cases.filter((c) => c.status === "Pending"); // Pending cases
  const approvedCases = isLoading
    ? []
    : cases.filter((c) => c.status === "Approved"); // Approved cases
  console.log("Total Cases:", totalCases.length);
  console.log("Pending Cases:", pendingCases.length);
  console.log("Approved Cases:", approvedCases.length);

  // const upcomingHearings = cases.filter((h) => h.status === "Upcoming"); // Filter upcoming hearings

  // Sample data
  const stats = [
    {
      title: "Total Applications",
      value: isLoading ? "Loading..." : totalCases.length.toString(),
      change: "+2 from last month",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Pending Applications",
      value: isLoading ? "Loading..." : pendingCases.length.toString(),
      change: "-1 from last month",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Approved Applications",
      value: isLoading ? "Loading..." : approvedCases.length.toString(),
      change: "+3 from last month",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Success Rate",
      value: "78%",
      change: "+5% from last month",
      icon: <PieChart className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const recentApplications = [
    {
      name: "State vs. Rahul Kumar",
      date: "2 days ago",
      status: "Pending",
      statusColor: "bg-yellow-500",
    },
    {
      name: "State vs. Amit Singh",
      date: "5 days ago",
      status: "Approved",
      statusColor: "bg-green-500",
    },
    {
      name: "State vs. Priya Sharma",
      date: "1 week ago",
      status: "Pending",
      statusColor: "bg-yellow-500",
    },
    {
      name: "State vs. Vikram Patel",
      date: "2 weeks ago",
      status: "Rejected",
      statusColor: "bg-red-500",
    },
  ];

  const upcomingHearings = [
    {
      month: "MAR",
      day: "24",
      name: "State vs. Rahul Kumar",
      time: "10:30 AM",
      location: "District Court, Delhi",
    },
    {
      month: "MAR",
      day: "28",
      name: "State vs. Priya Sharma",
      time: "11:00 AM",
      location: "High Court, Mumbai",
    },
    {
      month: "APR",
      day: "02",
      name: "State vs. Sunil Verma",
      time: "2:00 PM",
      location: "Sessions Court, Bangalore",
    },
  ];

  const quickAccessItems = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      label: "Bail Calculator",
      path: "/calculator",
    },
    {
      icon: <PieChart className="h-6 w-6 text-primary" />,
      label: "Risk Assessment",
      path: "/risk-assessment",
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      label: "Generate Application",
      path: "/application",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      label: "BNS Chatbot",
      path: "/chatbot",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleCaseClick = (caseId) => {
    navigate(`/judge/case/${caseId}`);
  };

  return (
    <DashboardLayout>
      <motion.div
        className="flex flex-col gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={item}
          className="flex flex-col md:flex-row justify-between md:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John Doe</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              New Application
            </Button>
            <Button>
              <PieChart className="mr-2 h-4 w-4" />
              Risk Assessment
            </Button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          variants={item}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <div className="h-7 w-16 bg-muted animate-pulse rounded mb-1"></div>
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.change}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={item}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        >
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                You have {pendingCases.length} pending applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading
                  ? Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-muted"></div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                              <div className="h-5 w-20 bg-muted animate-pulse rounded"></div>
                            </div>
                            <div className="h-4 w-16 bg-muted animate-pulse rounded mt-1"></div>
                          </div>
                        </div>
                      ))
                  : cases.map((app, index) => (
                      <motion.div
                        key={app.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                        onClick={() => handleCaseClick(app._id)}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            app.status === "Pending"
                              ? "bg-yellow-500"
                              : app.status === "Approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">
                              {app.applicant.firstName} vs{" "}
                              {app?.defendant?.firstName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              }).format(new Date(app.createdAt))}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {app.status}
                          </p>
                        </div>
                      </motion.div>
                    ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Hearings</CardTitle>
              <CardDescription>
                You have {upcomingHearings.length} hearings scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="min-w-[48px] h-14 rounded-md bg-muted animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1"></div>
                            <div className="h-4 w-40 bg-muted animate-pulse rounded"></div>
                          </div>
                        </div>
                      ))
                  : upcomingHearings.map((hearing, index) => (
                      <motion.div
                        key={hearing.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="min-w-[48px] rounded-md bg-primary/10 p-2 text-center">
                          <p className="text-xs font-medium">
                            {hearing.day} {"-"}
                            {hearing.month}
                          </p>
                          <p className="text-lg font-bold">{hearing.time}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{hearing.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {hearing.time} • {hearing.location}
                          </p>
                        </div>
                      </motion.div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Access */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Access key features of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickAccessItems.map((item, index) => (
                  <Link to={item.path} key={item.label}>
                    <motion.div
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="h-auto w-full flex flex-col items-center justify-center p-4 gap-2"
                      >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </Button>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
