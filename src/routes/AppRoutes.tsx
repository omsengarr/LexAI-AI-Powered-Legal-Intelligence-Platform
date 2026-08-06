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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route
          path="/documents/upload"
          element={<UploadDocumentPage />}
        />

        <Route path="/chat" element={<ChatPage />} />

        <Route path="/cases" element={<CaseSearchPage />} />

        <Route
          path="/risk-analysis"
          element={<RiskAnalysisPage />}
        />

        <Route
          path="/compliance"
          element={<CompliancePage />}
        />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;