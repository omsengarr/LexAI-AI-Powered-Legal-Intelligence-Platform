import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ========================================
// PUBLIC PAGES
// ========================================

const LandingPage = lazy(
  () => import("../pages/Landing/LandingPage")
);

const LoginPage = lazy(
  () => import("../pages/Auth/LoginPage")
);

const SignupPage = lazy(
  () => import("../pages/Auth/SignupPage")
);

// ========================================
// DASHBOARD
// ========================================

const DashboardPage = lazy(
  () => import("../pages/Dashboard/DashboardPage")
);

// ========================================
// DOCUMENTS
// ========================================

const UploadDocumentPage = lazy(
  () => import("../pages/Documents/UploadDocumentPage")
);

const DocumentList = lazy(
  () => import("../pages/Documents/DocumentList")
);

const DocumentAnalysisPage = lazy(
  () => import("../pages/Documents/DocumentAnalysisPage")
);

// ========================================
// ANALYTICS
// ========================================

const AnalyticsPage = lazy(
  () => import("../pages/Analytics/AnalyticsPage")
);

// ========================================
// JUDGMENT COMPARISON
// ========================================

const JudgmentComparisonPage = lazy(
  () => import("../pages/Comparison/JudgmentComparisonPage")
);

// ========================================
// AI CHAT
// ========================================

const ChatPage = lazy(
  () => import("../pages/Chat/ChatPage")
);

// ========================================
// CASES
// ========================================

const CaseSearchPage = lazy(
  () => import("../pages/Cases/CaseSearchPage")
);

const CaseDetailsPage = lazy(
  () => import("../pages/Cases/CaseDetailsPage")
);

// ========================================
// OTHER FEATURES
// ========================================

const RiskAnalysisPage = lazy(
  () => import("../pages/RiskAnalysis/RiskAnalysisPage")
);

const CompliancePage = lazy(
  () => import("../pages/Compliance/CompliancePage")
);

// ========================================
// PROFILE & SETTINGS
// ========================================

const ProfilePage = lazy(
  () => import("../pages/Profile/ProfilePage")
);

const SettingsPage = lazy(
  () => import("../pages/Settings/SettingsPage")
);

// ========================================
// COMMON
// ========================================

const NotFoundPage = lazy(
  () => import("../pages/NotFound/NotFoundPage")
);

import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// ========================================
// LOADING SCREEN
// ========================================

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-10 w-10 rounded-xl border border-cyan-400/20 bg-cyan-400/10 flex items-center justify-center">
            <div className="h-5 w-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-white">
            Loading LexAI
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Preparing your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// ROUTES
// ========================================

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;