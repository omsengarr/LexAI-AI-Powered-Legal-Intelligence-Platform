import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import UploadDocumentPage from "../pages/Documents/UploadDocumentPage";
import ChatPage from "../pages/Chat/ChatPage";
import CaseSearchPage from "../pages/Cases/CaseSearchPage";
import RiskAnalysisPage from "../pages/RiskAnalysis/RiskAnalysisPage";
import CompliancePage from "../pages/Compliance/CompliancePage";

import ProfilePage from "../pages/Profile/ProfilePage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

import AppLayout from "../components/AppLayout";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ============================== */}
        {/* Public Pages */}
        {/* ============================== */}

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


        {/* ============================== */}
        {/* Dashboard */}
        {/* ============================== */}

        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />


        {/* ============================== */}
        {/* Documents */}
        {/* ============================== */}

        <Route
          path="/documents/upload"
          element={
            <AppLayout>
              <UploadDocumentPage />
            </AppLayout>
          }
        />


        {/* ============================== */}
        {/* AI Chat */}
        {/* ============================== */}

        <Route
          path="/chat"
          element={
            <AppLayout>
              <ChatPage />
            </AppLayout>
          }
        />


        {/* ============================== */}
        {/* Case Search */}
        {/* ============================== */}

        <Route
          path="/cases"
          element={
            <AppLayout>
              <CaseSearchPage />
            </AppLayout>
          }
        />


        {/* ============================== */}
        {/* Risk Analysis */}
        {/* ============================== */}

        <Route
          path="/risk-analysis"
          element={
            <AppLayout>
              <RiskAnalysisPage />
            </AppLayout>
          }
        />


        {/* ============================== */}
        {/* Compliance */}
        {/* ============================== */}

        <Route
          path="/compliance"
          element={
            <AppLayout>
              <CompliancePage />
            </AppLayout>
          }
        />


        {/* ============================== */}
        {/* Profile */}
        {/* ============================== */}

        <Route
          path="/profile"
          element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          }
        />


        {/* ============================== */}
        {/* Not Found */}
        {/* ============================== */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;