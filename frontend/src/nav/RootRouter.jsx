
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

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public Routes */}
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

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>

                    {/* Member Routes */}
                    <Route element={<RoleRoute allowedRoles={["MEMBER"]} />}>
                        <Route path="/member/home" element={<Home />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>

                    {/* Librarian Routes */}
                    <Route element={<RoleRoute allowedRoles={["LIBRARIAN"]} />}>
                        <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
                    </Route>

                </Route>

                {/* Unauthorized Route */}
                <Route
                    path="/unauthorized"
                    element={<h2>403 - Access Denied</h2>}
                />

                {/* Not Found */}
                <Route
                    path="*"
                    element={<h2>404 - Page Not Found</h2>}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default RootRouter;
