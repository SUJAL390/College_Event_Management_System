// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  allowAdmin: boolean; // true if this route is for admin, false for student
  children: JSX.Element;
}

const ProtectedRoute = ({ allowAdmin, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  // Redirect if user is not allowed
  if (user.is_admin !== allowAdmin) {
    return user.is_admin ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/dashboard" />
    );
  }

  return children;
};

export default ProtectedRoute;
