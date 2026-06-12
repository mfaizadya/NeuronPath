import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Lazy-loaded pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const PretestPage = lazy(() => import('../pages/PretestPage'));
const TestPage = lazy(() => import('../pages/TestPage'));
const ResultPage = lazy(() => import('../pages/ResultPage'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
const ConsultationPage = lazy(() => import('../pages/ConsultationPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const PaymentPage = lazy(() => import('../pages/PaymentPage'));

// Loading fallback
const PageLoader = () => (
  <div className="loading-screen">
    <div className="spinner" />
    <p>Memuat halaman...</p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Memuat profil...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  
  return children;
};

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          
          {/* Auth Routes */}
          <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Main Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pretest" element={<PretestPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/result/:resultId?" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
          </Route>

          {/* Payment — protected, standalone (no sidebar) */}
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
