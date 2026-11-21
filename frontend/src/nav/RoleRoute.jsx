
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ allowedRoles }) {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        if (role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        if (role === "LIBRARIAN") {
            return <Navigate to="/librarian/dashboard" replace />;
        }

        if (role === "MEMBER") {
            return <Navigate to="/member/home" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default RoleRoute;
