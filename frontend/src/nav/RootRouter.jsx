import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Home from "../pages/member/Home";
import AdminDashboard from "../pages/admin/Dashboard";
import LibrarianDashboard from "../pages/librarian/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

function RootRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                {/* Role-based Routes */}
                <Route
                    path="/member/home"
                    element={
                        <RoleRoute allowedRoles={["MEMBER"]}>
                            <Home />
                        </RoleRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <RoleRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </RoleRoute>
                    }
                />

                <Route
                    path="/librarian/dashboard"
                    element={
                        <RoleRoute allowedRoles={["LIBRARIAN"]}>
                            <LibrarianDashboard />
                        </RoleRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default RootRouter;
