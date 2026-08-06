import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import UploadDocumentPage from "../pages/Documents/UploadDocumentPage";
import ChatPage from "../pages/Chat/ChatPage";

import ProfilePage from "../pages/Profile/ProfilePage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Documents */}
        <Route
          path="/documents/upload"
          element={<UploadDocumentPage />}
        />

        {/* AI Chat */}
        <Route path="/chat" element={<ChatPage />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;