import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthContext";
import { Toaster, ToastProvider } from "./components/ui/toaster";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import BailCalculator from "./pages/BailCalculator";
import RiskAssessment from "./pages/RiskAssessment";
import ApplicationGenerator from "./pages/ApplicationGenerator";
import CaseDiary from "./pages/CaseDiary";
import StatusTracking from "./pages/StatusTracking";
import LegalDatabase from "./pages/LegalDatabase";
import PredictiveAnalytics from "./pages/PredictiveAnalytics";
import Chatbot from "./pages/Chatbot";
import Feedback from "./pages/Feedback";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JudgeCalendar from "./pages/judge/JudgeCalendar";
import JudgeCaseView from "./pages/judge/JudgeCaseView";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="rihai-yukti-theme">
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private routes for all authenticated users */}
              <Route
                path="/dashboard"
                element={
                  // <PrivateRoute>
                  <Dashboard />
                  // </PrivateRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />

              <Route
                path="/feedback"
                element={
                  <PrivateRoute>
                    <Feedback />
                  </PrivateRoute>
                }
              />

              {/* Routes for lawyers and users */}
              <Route
                path="/calculator"
                element={
                  <RoleRoute roles={["lawyer", "user"]}>
                    <BailCalculator />
                  </RoleRoute>
                }
              />

              <Route
                path="/risk-assessment"
                element={
                  <RoleRoute roles={["lawyer", "user"]}>
                    <RiskAssessment />
                  </RoleRoute>
                }
              />

              <Route
                path="/application"
                element={
                  <RoleRoute roles={["lawyer"]}>
                    <ApplicationGenerator />
                  </RoleRoute>
                }
              />

              <Route
                path="/case-diary"
                element={
                  <RoleRoute roles={["lawyer", "user"]}>
                    <CaseDiary />
                  </RoleRoute>
                }
              />

              <Route
                path="/tracking"
                element={
                  <RoleRoute roles={["lawyer", "user"]}>
                    <StatusTracking />
                  </RoleRoute>
                }
              />

              <Route
                path="/database"
                element={
                  <RoleRoute roles={["lawyer", "user", "judge"]}>
                    <LegalDatabase />
                  </RoleRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <RoleRoute roles={["lawyer", "judge"]}>
                    <PredictiveAnalytics />
                  </RoleRoute>
                }
              />

              <Route
                path="/chatbot"
                element={
                  <RoleRoute roles={["lawyer", "user"]}>
                    <Chatbot />
                  </RoleRoute>
                }
              />

              {/* Judge specific routes */}
              <Route
                path="/judge/calendar"
                element={
                  <RoleRoute roles={["judge"]}>
                    <JudgeCalendar />
                  </RoleRoute>
                }
              />

              <Route
                path="/judge/case/:id"
                element={
                  <RoleRoute roles={["judge"]}>
                    <JudgeCaseView />
                  </RoleRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <Toaster />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
