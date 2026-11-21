
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Home from "../pages/member/Home";
import AdminLayout from "../pages/admin/inc/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import BookManagement from "../pages/admin/BookManagement";
import AuthorsCategories from "../pages/admin/AuthorsCategories";
import UserManagement from "../pages/admin/UserManagement";
import BorrowingRecords from "../pages/admin/BorrowingRecords";
import OverdueFines from "../pages/admin/OverdueFines";
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
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="books" element={<BookManagement />} />
                            <Route path="authors-categories" element={<AuthorsCategories />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="borrowings" element={<BorrowingRecords />} />
                            <Route path="overdue" element={<OverdueFines />} />
                        </Route>
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
