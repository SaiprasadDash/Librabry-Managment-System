
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Home from "../pages/member/Home";
import MemberLayout from "../pages/member/inc/MemberLayout";
import AllBooks from "../pages/member/AllBooks";
import BookReservations from "../pages/member/BookReservations";
import BorrowBooks from "../pages/member/BorrowBooks";
import MyDueBooks from "../pages/member/MyDueBooks";
import AdminLayout from "../pages/admin/inc/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import BookManagement from "../pages/admin/BookManagement";
import AuthorsCategories from "../pages/admin/AuthorsCategories";
import UserManagement from "../pages/admin/UserManagement";
import BorrowingRecords from "../pages/admin/BorrowingRecords";
import OverdueFines from "../pages/admin/OverdueFines";
import BookDeleteRequests from "../pages/admin/BookDeleteRequests";
import LibrarianDashboard from "../pages/librarian/Dashboard";
import LibrarianLayout from "../pages/librarian/inc/LibrarianLayout";
import LibrarianBookManagement from "../pages/librarian/BookManagement";
import LibrarianMemberManagement from "../pages/librarian/MemberManagement";
import LibrarianIssueBooks from "../pages/librarian/IssueBooks";
import LibrarianReturnBooks from "../pages/librarian/ReturnBooks";
import LibrarianBorrowingHistory from "../pages/librarian/BorrowingHistory";
import LibrarianOverdueBooks from "../pages/librarian/OverdueBooks";
import LibrarianFineManagement from "../pages/librarian/FineManagement";

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
                        <Route path="/member" element={<MemberLayout />}>
                            <Route index element={<Navigate to="/member/home" replace />} />
                            <Route path="home" element={<Home />} />
                            <Route path="books" element={<AllBooks />} />
                            <Route path="reservations" element={<BookReservations />} />
                            <Route path="borrow" element={<BorrowBooks />} />
                            <Route path="due" element={<MyDueBooks />} />
                        </Route>
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
                            <Route path="delete-requests" element={<BookDeleteRequests />} />
                        </Route>
                    </Route>

                    {/* Librarian Routes */}
                    <Route element={<RoleRoute allowedRoles={["LIBRARIAN"]} />}>
                        <Route path="/librarian" element={<LibrarianLayout />}>
                            <Route index element={<Navigate to="/librarian/dashboard" replace />} />
                            <Route path="dashboard" element={<LibrarianDashboard />} />
                            <Route path="books" element={<LibrarianBookManagement />} />
                            <Route path="members" element={<LibrarianMemberManagement />} />
                            <Route path="issue" element={<LibrarianIssueBooks />} />
                            <Route path="return" element={<LibrarianReturnBooks />} />
                            <Route path="history" element={<LibrarianBorrowingHistory />} />
                            <Route path="overdue" element={<LibrarianOverdueBooks />} />
                            <Route path="fines" element={<LibrarianFineManagement />} />
                        </Route>
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
