import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { AppLoader } from "../components/ui/AppLoader";

export function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}