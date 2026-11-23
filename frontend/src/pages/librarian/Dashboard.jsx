import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";
import { useNavigate } from "react-router-dom";

function LibrarianDashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await apiconnect.getData("/api/librarian/dashboard");
            setDashboardData(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch dashboard data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = dashboardData ? [
        {
            label: "Total Books",
            value: dashboardData.totalBooks,
            note: `${dashboardData.booksAddedThisMonth} added this month`,
            type: "books"
        },
        {
            label: "Total Members",
            value: dashboardData.totalMembers,
            note: `${dashboardData.membersJoinedThisWeek} joined this week`,
            type: "members"
        },
        {
            label: "Currently Borrowed",
            value: dashboardData.booksBorrowed,
            note: "Books issued",
            type: "borrowed"
        },
        {
            label: "Overdue Books",
            value: dashboardData.overdueBooks,
            note: `Rs. ${dashboardData.pendingFines} in fines`,
            type: "overdue"
        },
        {
            label: "Pending Fines",
            value: dashboardData.pendingFines,
            note: "From members",
            type: "fines"
        },
    ] : [];

    const recentBorrowings = dashboardData?.recentBorrowings || [];
    const overdueBooks = dashboardData?.overdueBooksList || [];

    const getStatusClass = (status) => {
        switch (status) {
            case "BORROWED": return "available";
            case "OVERDUE": return "overdue";
            case "RETURNED": return "active";
            default: return "inactive";
        }
    };

    if (loading) {
        return <div className="admin-dashboard">Loading...</div>;
    }

    if (error) {
        return <div className="admin-dashboard">Error: {error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-stats-grid">
                {stats.map((stat) => (
                    <div key={stat.label} className={`admin-stat-card admin-stat-${stat.type}`}>
                        <span className="admin-stat-label">{stat.label}</span>
                        <span className="admin-stat-value">{stat.value.toLocaleString()}</span>
                        <span className="admin-stat-note">{stat.note}</span>
                    </div>
                ))}
            </div>

            <div className="admin-dashboard-panels">
                <section className="admin-panel">
                    <h2 className="admin-panel-title">Quick Actions</h2>
                    <div className="admin-quick-actions">
                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={() => navigate("/librarian/issue")}
                        >
                            Issue Book
                        </button>

                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={() => navigate("/librarian/return")}
                        >
                            Return Book
                        </button>

                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={() => navigate("/librarian/books")}
                        >
                            Add Book
                        </button>
                    </div>
                </section>

                <section className="admin-panel">
                    <h2 className="admin-panel-title">Recent Borrowings</h2>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Member</th>
                                    <th>Borrowed On</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBorrowings.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                                            No recent borrowings
                                        </td>
                                    </tr>
                                ) : (
                                    recentBorrowings.map((record, index) => (
                                        <tr key={index}>
                                            <td>{record.bookTitle}</td>
                                            <td>{record.memberName}</td>
                                            <td>{record.borrowedOn}</td>
                                            <td>{record.dueDate}</td>
                                            <td>
                                                <span className={`admin-badge admin-badge-${getStatusClass(record.status)}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="admin-panel">
                    <h2 className="admin-panel-title">Overdue Books</h2>
                    <ul className="admin-overdue-list">
                        {overdueBooks.length === 0 ? (
                            <li className="admin-overdue-item" style={{ justifyContent: "center" }}>
                                <span style={{ color: "var(--text)" }}>No overdue books</span>
                            </li>
                        ) : (
                            overdueBooks.map((item, index) => (
                                <li key={index} className="admin-overdue-item">
                                    <div>
                                        <p className="admin-overdue-book">{item.bookTitle}</p>
                                        <p className="admin-overdue-member">{item.memberName}</p>
                                    </div>
                                    <div className="admin-overdue-meta">
                                        <span className="admin-overdue-days">{item.overdueDays} days</span>
                                        <span className="admin-overdue-fine">Rs. {item.fine}</span>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default LibrarianDashboard;
