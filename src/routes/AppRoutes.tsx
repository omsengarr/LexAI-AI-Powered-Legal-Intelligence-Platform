import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import UploadDocumentPage from "../pages/Documents/UploadDocumentPage";
import DocumentList from "../pages/Documents/DocumentList";

import ChatPage from "../pages/Chat/ChatPage";
import CaseSearchPage from "../pages/Cases/CaseSearchPage";
import RiskAnalysisPage from "../pages/RiskAnalysis/RiskAnalysisPage";
import CompliancePage from "../pages/Compliance/CompliancePage";

import ProfilePage from "../pages/Profile/ProfilePage";
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
        {/* PROTECTED DASHBOARD */}
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
        {/* PROTECTED DOCUMENTS */}
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
        {/* PROTECTED AI CHAT */}
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
        {/* PROTECTED CASE SEARCH */}
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
        {/* PROTECTED RISK ANALYSIS */}
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
        {/* PROTECTED COMPLIANCE */}
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
        {/* PROTECTED PROFILE */}
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