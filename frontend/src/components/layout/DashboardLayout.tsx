"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Calendar,
  FileText,
  Home,
  MessageSquare,
  PieChart,
  Scale,
  Settings,
  User,
  BarChart,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../../services/api.ts";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const location = useLocation();

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserRole(user.role || "");
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUserRole("");
      }
    }
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: <Home className="h-4 w-4" />,
      label: "Dashboard",
    },
    {
      path: "/calculator",
      icon: <FileText className="h-4 w-4" />,
      label: "Bail Calculator",
    },
    {
      path: "/risk-assessment",
      icon: <PieChart className="h-4 w-4" />,
      label: "Risk Assessment",
    },
    // Application Generator - only visible for lawyers
    ...(userRole === "lawyer" ? [{
      path: "/application",
      icon: <FileText className="h-4 w-4" />,
      label: "Application Generator",
    }] : []),
    {
      path: "/case-diary",
      icon: <FileText className="h-4 w-4" />,
      label: "Case Diary",
    },
    {
      path: "/status-tracking",
      icon: <Calendar className="h-4 w-4" />,
      label: "Status Tracking",
    },
    {
      path: "/legal-database",
      icon: <BarChart className="h-4 w-4" />,
      label: "Legal Database",
    },
    {
      path: "/predictive-analytics",
      icon: <BarChart className="h-4 w-4" />,
      label: "Predictive Analytics",
    },
    {
      path: "/chatbot",
      icon: <MessageSquare className="h-4 w-4" />,
      label: "BNS Chatbot",
    },
    {
      path: "/feedback",
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Feedback",
    },
  ];

  // Notifications data
  const notifications = [
    {
      id: 1,
      title: "Hearing Reminder",
      message:
        "Upcoming hearing for State vs. Rahul Kumar tomorrow at 10:30 AM",
      time: "5 min ago",
    },
    {
      id: 2,
      title: "Application Status",
      message: "Bail application BA-145/2023 has been scheduled for hearing",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "New Feature",
      message: "Predictive Analytics module has been updated with new features",
      time: "1 day ago",
    },
  ];

  // User data
  const userData = async () => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching user data: ${error}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 bg-card border-r p-4 transition-all duration-300 ease-in-out lg:static lg:z-0 ${
          sidebarCollapsed && !sidebarOpen ? "w-[70px]" : "w-64"
        }`}
        initial={isMobile ? { x: "-100%" } : { x: 0 }}
        animate={{
          x: sidebarOpen || !isMobile ? 0 : isMobile ? "-100%" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between mb-8">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed || sidebarOpen ? (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Scale className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Rihai Yukti</h1>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Scale className="h-6 w-6 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-muted-foreground"
              }`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              {item.icon}
              <AnimatePresence mode="wait">
                {(!sidebarCollapsed || sidebarOpen) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors ${
              isActive("/settings")
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted text-muted-foreground"
            }`}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <Settings className="h-4 w-4" />
            <AnimatePresence mode="wait">
              {(!sidebarCollapsed || sidebarOpen) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <div className="flex items-center justify-between px-3 py-2 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <AnimatePresence mode="wait">
                {(!sidebarCollapsed || sidebarOpen) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm font-medium">{userData.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {userData.role}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              {(!sidebarCollapsed || sidebarOpen) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThemeToggle />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-30">
          <div className="flex h-16 items-center px-4 gap-4">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            <div className="flex-1 flex items-center">
              <motion.h1
                className="text-lg font-semibold lg:hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                Rihai Yukti
              </motion.h1>

              <motion.div
                className="ml-auto flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {/* Notifications Dropdown */}
                <div className="relative">
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {notifications.length}
                    </span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </div>

                <div className="hidden md:block">
                  <ThemeToggle />
                </div>

                {/* User Menu */}
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{userData.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {userData.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export { DashboardLayout };
