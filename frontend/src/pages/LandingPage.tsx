"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, useAnimation } from "framer-motion"
import {
  Scale,
  Shield,
  Brain,
  ArrowRight,
  MessageSquare,
  Clock,
  BarChart4,
  FileText,
  Database,
  AlertCircle,
} from "lucide-react"
import { Button } from "../components/ui/button"

interface Feature {
  icon: JSX.Element
  title: string
  description: string
}

interface Statistic {
  value: string
  label: string
}

interface Benefit {
  icon: JSX.Element
  text: string
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const controls = useAnimation()

  const startAnimation = useCallback(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }))
  }, [controls])

  useEffect(() => {
    startAnimation()
  }, [startAnimation])

  const features: Feature[] = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Risk Assessment",
      description: "Advanced machine learning algorithms provide instant risk assessment and bail eligibility analysis",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Automatic Bail Application",
      description: "Generate compliant bail applications with just a few clicks",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Legal Database Integration",
      description: "Access to IPC, BNS, BSS, and BSA with updated judicial pronouncements",
    },
  ]

  const statistics: Statistic[] = [
    { value: "95%", label: "Accuracy Rate" },
    { value: "30K+", label: "Cases Processed" },
    { value: "24/7", label: "Support" },
    { value: "50+", label: "Legal Experts" },
  ]

  const benefits: Benefit[] = [
    {
      icon: <Clock />,
      text: "Save up to 80% of your time on bail application process",
    },
    { icon: <Shield />, text: "Enterprise-grade security for sensitive case data" },
    { icon: <BarChart4 />, text: "Predictive analytics for bail approval likelihood" },
    { icon: <AlertCircle />, text: "Compliant with Indian legal framework" },
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 shadow-lg backdrop-blur-sm">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="text-2xl font-bold text-primary">Rihai Yukti</div>
          <ul className="hidden md:flex space-x-6 text-gray-600">
            <li className="cursor-pointer hover:text-primary mt-2" onClick={() => scrollToSection("features")}>
              Features
            </li>
            <li className="cursor-pointer hover:text-primary mt-2" onClick={() => scrollToSection("statistics")}>
              Statistics
            </li>
            <li className="cursor-pointer hover:text-primary mt-2" onClick={() => scrollToSection("benefits")}>
              Benefits
            </li>
            <li className="cursor-pointer hover:text-primary mt-2" onClick={() => scrollToSection("footer")}>
              Contact
            </li>
            <li>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => (window.location.href = "/login")}
              >
                Login
              </Button>
            </li>
          </ul>
          <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background shadow-lg p-4">
            <ul className="space-y-3">
              <li className="cursor-pointer hover:text-primary" onClick={() => scrollToSection("features")}>
                Features
              </li>
              <li className="cursor-pointer hover:text-primary" onClick={() => scrollToSection("statistics")}>
                Statistics
              </li>
              <li className="cursor-pointer hover:text-primary" onClick={() => scrollToSection("benefits")}>
                Benefits
              </li>
              <li className="cursor-pointer hover:text-primary" onClick={() => scrollToSection("footer")}>
                Contact
              </li>
              <li>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => (window.location.href = "/login")}
                >
                  Login
                </Button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="container px-4 pt-32 pb-32 mx-auto"
        >
          <div className="flex flex-col items-center max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-3 mb-6 rounded-full bg-primary/10"
            >
              <Scale className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h1
              className="mb-6 text-4xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text"
              variants={fadeInUp}
            >
              Streamlining Bail Applications with AI
            </motion.h1>
            <motion.p className="mb-8 text-xl text-gray-600" variants={fadeInUp}>
              Transform your bail application process with cutting-edge AI technology. Automate risk assessment,
              generate applications, and predict approval likelihood.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
              <Button className="flex items-center gap-2 px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-white">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 rounded-full border-primary text-primary hover:bg-gray-100"
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 transition-shadow bg-white shadow-lg rounded-xl hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                custom={index}
                animate={controls}
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="py-20 bg-primary/5">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {statistics.map((stat, index) => (
              <motion.div key={index} className="text-center" custom={index} animate={controls}>
                <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid items-center gap-12 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="ml-0 md:ml-8">
              <h2 className="mb-6 text-3xl md:text-4xl font-bold">Why Choose Rihai Yukti?</h2>
              <div className="space-y-4">
                {benefits.map((item, index) => (
                  <motion.div key={index} className="flex items-center gap-3" custom={index} animate={controls}>
                    <div className="text-primary">{item.icon}</div>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              className="relative h-[300px] md:h-[400px]"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl">
                <img src="/placeholder.svg" alt="Bail Reckoner dashboard" className="object-cover w-full h-full" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Bail Management</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Our platform offers end-to-end solutions for the entire bail application process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Database className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Legal Database Integration</h3>
              <p className="text-gray-600">
                Access to IPC, Bhartiya Nyaya Sanhita 2023, Bhartiya Suraksha Sanhita 2023, and Bhartiya Saakshya
                Adhiniyam 2023.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bail Eligibility Calculator</h3>
              <p className="text-gray-600">
                Automate bail eligibility calculations based on CrPC and BNSS provisions, considering offense severity
                and imprisonment duration.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Risk Assessment Module</h3>
              <p className="text-gray-600">
                Assign risk scores based on criminal history, flight risk, severity of charges, and social/economic
                background.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart4 className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-gray-600">
                Use machine learning models to predict the likelihood of bail approval based on historical case data.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Status Tracking</h3>
              <p className="text-gray-600">
                Monitor the progress of bail applications with real-time updates on court schedules and hearing dates.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">BNS Chatbot</h3>
              <p className="text-gray-600">
                Get instant assistance and answers to queries about the bail process, legal provisions, and procedural
                requirements.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="mb-6 text-3xl md:text-4xl font-bold text-white">
              Ready to Transform Your Bail Application Process?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/80">
              Join legal professionals who are already using Rihai Yukti to streamline their bail application process.
            </p>
            <Button className="px-8 py-6 bg-white rounded-full text-primary hover:bg-gray-100">Start Free Trial</Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-12 text-white bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            {/* About Section */}
            <div>
              <Scale className="w-10 h-10 mb-4 text-primary" />
              <p className="text-gray-400">
                At Rihai Yukti, we empower legal professionals by leveraging AI to streamline the bail application
                process, automate risk assessment, and provide legal compliance guidance within the Indian legal
                ecosystem.
              </p>
            </div>

            {/* Product Section */}
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="cursor-pointer hover:text-primary">Bail Eligibility Calculator</li>
                <li className="cursor-pointer hover:text-primary">Risk Assessment Module</li>
                <li className="cursor-pointer hover:text-primary">Bail Application Generator</li>
                <li className="cursor-pointer hover:text-primary">Predictive Analytics</li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="cursor-pointer hover:text-primary">About Us</li>
                <li className="cursor-pointer hover:text-primary">Careers</li>
                <li className="cursor-pointer hover:text-primary">Press</li>
                <li className="cursor-pointer hover:text-primary">Contact</li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h3 className="mb-4 font-semibold">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="cursor-pointer hover:text-primary">Blog</li>
                <li className="cursor-pointer hover:text-primary">Legal Insights</li>
                <li className="cursor-pointer hover:text-primary">Case Studies</li>
                <li className="cursor-pointer hover:text-primary">Help Center</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-12 text-center text-gray-400 border-t border-gray-800">
            <p>© {new Date().getFullYear()} Rihai Yukti. All rights reserved.</p>
            <p>Made with ❤️ by Team PartTimeHumans</p>
            <p>
              Follow us on
              <a href="#" className="mx-1 text-primary hover:underline">
                X
              </a>
              &
              <a href="#" className="mx-1 text-primary hover:underline">
                LinkedIn
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

