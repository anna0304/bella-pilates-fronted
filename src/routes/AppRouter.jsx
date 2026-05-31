import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { PublicLayout } from "../layouts/PublicLayout";

import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

import { ScrollToTop } from "../components/common/ScrollToTop";

/* PUBLIC */
import { HomePage } from "../pages/public/HomePage";
import { ClassesPage } from "../pages/public/ClassesPage";
import { SchedulesPage } from "../pages/public/SchedulesPage";
import { PlansPage } from "../pages/public/PlansPage";
import { AboutPage } from "../pages/public/AboutPage";
import { ContactPage as PublicContactPage } from "../pages/public/ContactPage";

/* USER */
import { UserDashboardPage } from "../pages/users/dashboard/UserDashboardPage";

import { ReservationsPage } from "../pages/users/reservations/ReservationsPage";
import { CreateReservationPage } from "../pages/users/reservations/CreateReservationPage";
import { SelectDateTimePage } from "../pages/users/reservations/SelectDateTimePage";
import { ReservationUserDataPage } from "../pages/users/reservations/ReservationUserDataPage";
import { ConfirmReservationPage } from "../pages/users/reservations/ConfirmReservationPage";
import { ReservationDetailPage } from "../pages/users/reservations/ReservationDetailPage";
import { CancelReservationPage } from "../pages/users/reservations/CancelReservationPage";
import { CancelledReservationPage } from "../pages/users/reservations/CancelledReservationPage";
import { CancellationPolicyPage } from "../pages/users/reservations/CancellationPolicyPage";

import { RecordedClassesPage } from "../pages/users/recordedclasses/RecordedClassesPage";
import { RecordedClassDetailPage } from "../pages/users/recordedclasses/RecordedClassDetailPage";

import { FavoritesPage } from "../pages/users/favorites/FavoritesPage";
import { ProfilePage } from "../pages/users/profile/ProfilePage";
import { ContactPage as UserContactPage } from "../pages/users/contact/ContactPage";

/* ADMIN */
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "../pages/admin/users/AdminUsersPage";
import { AdminClassesPage } from "../pages/admin/classes/AdminClassesPage";
import { CreateClassPage } from "../pages/admin/classes/CreateClassPage";
import { AdminSchedulesPage } from "../pages/admin/schedules/AdminSchedulesPage";
import { CreateSchedulePage } from "../pages/admin/schedules/CreateSchedulePage";
import { AdminReservationsPage } from "../pages/admin/reservations/AdminReservationsPage";
import { CreateReservationPage as AdminCreateReservationPage } from "../pages/admin/reservations/CreateReservationPage";
import { AdminRecordedClassesPage } from "../pages/admin/recordedClasses/AdminRecordedClassesPage";
import { CreateRecordedClassPage } from "../pages/admin/recordedClasses/CreateRecordedClassPage";
import { AdminPaymentsPage } from "../pages/admin/payments/AdminPaymentsPage";
import { CreateManualPaymentPage } from "../pages/admin/payments/CreateManualPaymentPage";
import { AdminReportsPage } from "../pages/admin/reports/AdminReportsPage";
import { AdminMessagesPage } from "../pages/admin/messages/AdminMessagesPage";
import { AdminSettingsPage } from "../pages/admin/settings/AdminSettingsPage";
("");

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<PublicContactPage />} />
          {/* <Route path="/admin/users" element={<AdminUsersPage />} /> */}
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <ReservationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations/new"
          element={
            <ProtectedRoute>
              <CreateReservationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations/date-time"
          element={
            <ProtectedRoute>
              <SelectDateTimePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations/user-data"
          element={
            <ProtectedRoute>
              <ReservationUserDataPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations/confirm"
          element={
            <ProtectedRoute>
              <ConfirmReservationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations/policy"
          element={
            <ProtectedRoute>
              <CancellationPolicyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations/:id"
          element={
            <ProtectedRoute>
              <ReservationDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations/:id/cancel"
          element={
            <ProtectedRoute>
              <CancelReservationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations/:id/cancelled"
          element={
            <ProtectedRoute>
              <CancelledReservationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recorded-classes"
          element={
            <ProtectedRoute>
              <RecordedClassesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recorded-classes/:id"
          element={
            <ProtectedRoute>
              <RecordedClassDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/contact"
          element={
            <ProtectedRoute>
              <UserContactPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/classes"
          element={
            <AdminRoute>
              <AdminClassesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/classes/new"
          element={
            <AdminRoute>
              <CreateClassPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/schedules"
          element={
            <AdminRoute>
              <AdminSchedulesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/schedules/new"
          element={
            <AdminRoute>
              <CreateSchedulePage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reservations"
          element={
            <AdminRoute>
              <AdminReservationsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reservations/new"
          element={
            <AdminRoute>
              <AdminCreateReservationPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/recorded-classes"
          element={
            <AdminRoute>
              <AdminRecordedClassesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/recorded-classes/new"
          element={
            <AdminRoute>
              <CreateRecordedClassPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <AdminPaymentsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/payments/new"
          element={
            <AdminRoute>
              <CreateManualPaymentPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReportsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <AdminRoute>
              <AdminMessagesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettingsPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
