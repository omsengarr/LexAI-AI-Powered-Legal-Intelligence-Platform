import { BrowserRouter, Routes, Route } from "react-router-dom";

// ========================================
// PUBLIC PAGES
// ========================================

import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";

// ========================================
// DASHBOARD
// ========================================

import DashboardPage from "../pages/Dashboard/DashboardPage";

// ========================================
// DOCUMENTS
// ========================================

import UploadDocumentPage from "../pages/Documents/UploadDocumentPage";
import DocumentList from "../pages/Documents/DocumentList";
import DocumentAnalysisPage from "../pages/Documents/DocumentAnalysisPage";

// ========================================
// ANALYTICS
// ========================================

import AnalyticsPage from "../pages/Analytics/AnalyticsPage";

// ========================================
// JUDGMENT COMPARISON
// ========================================

import JudgmentComparisonPage from "../pages/Comparison/JudgmentComparisonPage";

// ========================================
// AI CHAT
// ========================================

import ChatPage from "../pages/Chat/ChatPage";

// ========================================
// CASES
// ========================================

import CaseSearchPage from "../pages/Cases/CaseSearchPage";
import CaseDetailsPage from "../pages/Cases/CaseDetailsPage";

// ========================================
// OTHER FEATURES
// ========================================

import RiskAnalysisPage from "../pages/RiskAnalysis/RiskAnalysisPage";
import CompliancePage from "../pages/Compliance/CompliancePage";

// ========================================
// PROFILE & SETTINGS
// ========================================

import ProfilePage from "../pages/Profile/ProfilePage";
import SettingsPage from "../pages/Settings/SettingsPage";

// ========================================
// COMMON
// ========================================

import NotFoundPage from "../pages/NotFound/NotFoundPage";
import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ======================================== */}
        {/* PUBLIC PAGES */}
        {/* ======================================== */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />


        {/* ======================================== */}
        {/* DASHBOARD */}
        {/* ======================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* ANALYTICS */}
        {/* ======================================== */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AnalyticsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* JUDGMENT COMPARISON */}
        {/* ======================================== */}

        <Route
          path="/comparison"
          element={
            <ProtectedRoute>
              <AppLayout>
                <JudgmentComparisonPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* DOCUMENTS */}
        {/* ======================================== */}

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DocumentList />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/upload"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UploadDocumentPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* ======================================== */}
        {/* DOCUMENT ANALYSIS */}
        {/* ======================================== */}

        <Route
          path="/documents/analyze"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DocumentAnalysisPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* AI CHAT */}
        {/* ======================================== */}

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ChatPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* CASE SEARCH */}
        {/* ======================================== */}

        <Route
          path="/cases"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CaseSearchPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* CASE DETAILS */}
        {/* ======================================== */}

        <Route
          path="/cases/:caseId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CaseDetailsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* RISK ANALYSIS */}
        {/* ======================================== */}

        <Route
          path="/risk-analysis"
          element={
            <ProtectedRoute>
              <AppLayout>
                <RiskAnalysisPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* COMPLIANCE */}
        {/* ======================================== */}

        <Route
          path="/compliance"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CompliancePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* PROFILE */}
        {/* ======================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* SETTINGS */}
        {/* ======================================== */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        {/* ======================================== */}
        {/* NOT FOUND */}
        {/* ======================================== */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;