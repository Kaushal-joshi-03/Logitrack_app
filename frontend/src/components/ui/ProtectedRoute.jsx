import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location, requireLogin: true }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user?.role) {
    const rawRole = String(user.role).toLowerCase().trim();
    const userRoleLower = rawRole === "delivery_person" ? "delivery" : rawRole;

    const isAllowed = allowedRoles.some((role) => {
      const normalizedAllowed = String(role).toLowerCase().trim();
      const mappedAllowed = normalizedAllowed === "delivery_person" ? "delivery" : normalizedAllowed;
      return mappedAllowed === userRoleLower;
    });

    if (!isAllowed) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

