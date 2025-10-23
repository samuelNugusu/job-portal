import { Routes, Route } from "react-router-dom";
import { SignInPage, SignUpPage, ProtectedRoute } from "./pages/AuthPages";
import { lazy, Suspense } from "react";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const JobDetailPage = lazy(() => import("./pages/JobDetailPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MyJobsPage = lazy(() => import("./pages/MyJobsPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage"));
const TrackerPage = lazy(() => import("./pages/TrackerPage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes (no auth required) */}
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* Protected routes (requires authentication) */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/jobs/:id" element={<JobDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-jobs" element={<MyJobsPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/tracker" element={<TrackerPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
