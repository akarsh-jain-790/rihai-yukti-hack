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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Calendar,
  FileText,
  MessageSquare,
  PieChart,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Sample data
  const stats = [
    {
      title: "Total Applications",
      value: "12",
      change: "+2 from last month",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Pending Applications",
      value: "4",
      change: "-1 from last month",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Approved Applications",
      value: "7",
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

        // Calculate stats
        const pendingCount = cases.filter(
          (c: any) => c.status === "Pending"
        ).length;
        const approvedCount = cases.filter(
          (c: any) => c.status === "Approved"
        ).length;
        const rejectedCount = cases.filter(
          (c: any) => c.status === "Rejected"
        ).length;
        const totalCount = cases.length;
        const successRate =
          totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

        setStats([
          {
            title: "Total Applications",
            value: totalCount.toString(),
            change: "+2 from last month",
            icon: <FileText className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Pending Applications",
            value: pendingCount.toString(),
            change: "-1 from last month",
            icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Approved Applications",
            value: approvedCount.toString(),
            change: "+3 from last month",
            icon: <FileText className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Success Rate",
            value: `${successRate}%`,
            change: "+5% from last month",
            icon: <PieChart className="h-4 w-4 text-muted-foreground" />,
          },
        ]);

        // Process hearings data
        const hearings = hearingsResponse || [];

        // Filter today's hearings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaysHearings = hearings.filter((h: any) => {
          const hearingDate = new Date(h.date);
          return hearingDate >= today && hearingDate < tomorrow;
        });

        setTodayHearings(
          todaysHearings.map((h: any) => ({
            id: h._id,
            caseNumber: h.caseId?.caseNumber || "N/A",
            title: h.caseId?.title || "Unknown Case",
            time: h.time,
            court: h.location,
            type: h.purpose,
            complexity: h.complexity || "Standard",
          }))
        );

        // Filter upcoming hearings
        const upcomingHearingsList = hearings.filter((h: any) => {
          const hearingDate = new Date(h.date);
          return hearingDate >= tomorrow;
        });

        setUpcomingHearings(
          upcomingHearingsList.map((h: any) => {
            const hearingDate = new Date(h.date);
            return {
              id: h._id,
              month: hearingDate
                .toLocaleString("default", { month: "short" })
                .toUpperCase(),
              day: hearingDate.getDate().toString(),
              name: h.caseId?.title || "Unknown Case",
              time: h.time,
              location: h.location,
              date: h.date,
            };
          })
        );

        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.msg || "Failed to load dashboard data");
        addToast({
          title: "Error",
          description: "Failed to load dashboard data",
          type: "error",
        });
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, addToast]);

  const handleCaseClick = (id: string) => {
    if (user?.role === "judge") {
      navigate(`/judge/case/${id}`);
    } else {
      navigate(`/case/${id}`);
    }
  };

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

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

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
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || "User"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/application")}>
              <FileText className="mr-2 h-4 w-4" />
              New Application
            </Button>
            <Button onClick={() => navigate("/risk-assessment")}>
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

        {/* Tabs for Hearings */}
        <motion.div variants={item} className="mt-6">
          <Tabs defaultValue="today" className="w-full">
            <TabsList>
              <TabsTrigger value="today" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Today's Hearings
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming Hearings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Hearings</CardTitle>
                  <CardDescription>
                    Hearings scheduled for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array(2)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1"></div>
                                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                              </div>
                              <div className="text-right">
                                <div className="h-5 w-16 bg-muted animate-pulse rounded mb-1"></div>
                                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : todayHearings.length > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Simple Cases</h3>
                        <div className="space-y-2">
                          {todayHearings
                            .filter(
                              (hearing) => hearing.complexity === "Simple"
                            )
                            .map((hearing) => (
                              <div
                                key={hearing.id}
                                className="p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
                                onClick={() => handleCaseClick(hearing.id)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      {hearing.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {hearing.caseNumber}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {hearing.time}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {hearing.court}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {hearing.type}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Complex Cases</h3>
                        <div className="space-y-2">
                          {todayHearings
                            .filter(
                              (hearing) => hearing.complexity === "Complex"
                            )
                            .map((hearing) => (
                              <div
                                key={hearing.id}
                                className="p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
                                onClick={() => handleCaseClick(hearing.id)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      {hearing.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {hearing.caseNumber}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {hearing.time}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {hearing.court}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {hearing.type}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-1">
                        No Hearings Today
                      </h3>
                      <p className="text-muted-foreground">
                        You have no hearings scheduled for today.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Hearings</CardTitle>
                  <CardDescription>
                    Hearings scheduled for the next 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i}>
                            <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2"></div>
                            <div className="p-3 border rounded-md">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1"></div>
                                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                                </div>
                                <div className="text-right">
                                  <div className="h-5 w-16 bg-muted animate-pulse rounded mb-1"></div>
                                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : upcomingHearings.length > 0 ? (
                    <div className="space-y-6">
                      {/* Group hearings by date */}
                      {Array.from(
                        new Set(upcomingHearings.map((h) => h.date))
                      ).map((date) => (
                        <div key={date}>
                          <h3 className="font-medium mb-2">
                            {new Date(date).toLocaleDateString(undefined, {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </h3>
                          <div className="space-y-2">
                            {upcomingHearings
                              .filter((hearing) => hearing.date === date)
                              .map((hearing) => (
                                <div
                                  key={hearing.id}
                                  className="p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
                                  onClick={() => handleCaseClick(hearing.id)}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">
                                        {hearing.name}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">
                                        {hearing.time}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {hearing.location}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-1">
                        No Upcoming Hearings
                      </h3>
                      <p className="text-muted-foreground">
                        You have no hearings scheduled for the next 7 days.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={item}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        >
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>You have 4 pending applications</CardDescription>
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
                  : recentApplications.map((app, index) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-4 cursor-pointer hover:bg-muted p-2 rounded-md"
                        onClick={() => handleCaseClick(app.id)}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${app.statusColor}`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{app.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {app.date}
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

          {/* Quick Access */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Access key features of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
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
