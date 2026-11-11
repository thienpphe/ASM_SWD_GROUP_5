import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { SubjectRegisterModal } from './components/SubjectRegisterModal';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { BlogsPage } from './pages/BlogsPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { PracticesListPage } from './pages/PracticesListPage';
import { PracticeDetailsPage } from './pages/PracticeDetailsPage';
import { SimulationExamsPage } from './pages/SimulationExamsPage';
import { QuizHandlePage } from './pages/QuizHandlePage';
import { QuizReviewPage } from './pages/QuizReviewPage';
import { MarketingDashboard } from './pages/MarketingDashboard';
import { BlogsManagementPage } from './pages/BlogsManagementPage';

import SlidersManagementPage from './pages/SlidersManagementPage';
import CoursesManagementPage from './pages/CoursesManagementPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonsManagementPage from './pages/LessonsManagementPage';
import QuestionsBankPage from './pages/QuestionsBankPage';
import QuizzesManagementPage from './pages/QuizzesManagementPage';
import QuizDetailPage from './pages/QuizDetailPage';
import SalesRegistrationsPage from './pages/SalesRegistrationsPage';
import UsersManagementPage from './pages/UsersManagementPage';
import SettingsManagementPage from './pages/SettingsManagementPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:id" element={<SubjectDetailPage />} />

          {/* Customer Routes */}
          <Route
            path="/customer/registrations"
            element={
              <ProtectedRoute>
                <MyRegistrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute>
                <MyRegistrationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/practices"
            element={
              <ProtectedRoute>
                <PracticesListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practices"
            element={
              <ProtectedRoute>
                <PracticesListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practices/new"
            element={
              <ProtectedRoute>
                <PracticeDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practices/:id"
            element={
              <ProtectedRoute>
                <PracticeDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/simulation"
            element={
              <ProtectedRoute>
                <SimulationExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulations"
            element={
              <ProtectedRoute>
                <SimulationExamsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/:sessionId"
            element={
              <ProtectedRoute>
                <QuizHandlePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:sessionId/review"
            element={
              <ProtectedRoute>
                <QuizReviewPage />
              </ProtectedRoute>
            }
          />

          {/* Marketing Routes */}
          <Route
            path="/marketing/dashboard"
            element={
              <ProtectedRoute allowedRoles={['MARKETING', 'ADMIN', 'SALE']}>
                <MarketingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketing/blogs"
            element={
              <ProtectedRoute allowedRoles={['MARKETING', 'ADMIN']}>
                <BlogsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketing/sliders"
            element={
              <ProtectedRoute allowedRoles={['MARKETING', 'ADMIN']}>
                <SlidersManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Course & Content Management (Expert, Admin) */}
          <Route
            path="/courses/manage"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <CoursesManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <CoursesManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <CourseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/lessons"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <LessonsManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Testing Content Management (Questions & Quizzes) */}
          <Route
            path="/testing/questions"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <QuestionsBankPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <QuestionsBankPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/testing/quizzes"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <QuizzesManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <QuizzesManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes/:id"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <QuizDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/testing/quizzes/:id"
            element={
              <ProtectedRoute allowedRoles={['EXPERT', 'ADMIN']}>
                <QuizDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Sales Management */}
          <Route
            path="/sales/registrations"
            element={
              <ProtectedRoute allowedRoles={['SALE', 'ADMIN']}>
                <SalesRegistrationsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Management */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UsersManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <SettingsManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <ProfileModal />
      <ChangePasswordModal />
      <SubjectRegisterModal />
    </div>
  );
}
