import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles }) {
    const { isAuthenticated, role } = useAuth();

    // Also check localStorage as fallback for immediate navigation
    const localStorageRole = localStorage.getItem("role");
    const effectiveRole = role || localStorageRole;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(effectiveRole)) {
        // Redirect to appropriate dashboard based on role
        if (effectiveRole === "MEMBER") {
            return <Navigate to="/member/home" replace />;
        } else if (effectiveRole === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (effectiveRole === "LIBRARIAN") {
            return <Navigate to="/librarian/dashboard" replace />;
        } else {
            return <Navigate to="/home" replace />;
        }
    }

    return children;
}

export default RoleRoute;
