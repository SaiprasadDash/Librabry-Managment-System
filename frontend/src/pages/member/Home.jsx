import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function Home() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        myBorrowed: 0,
        myReservations: 0,
        myFines: 0,
    });
    const [recentBorrowings, setRecentBorrowings] = useState([]);
    const [recentReservations, setRecentReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [booksData, borrowingsData, reservationsData] = await Promise.all([
                apiconnect.getData("/api/books"),
                apiconnect.getData("/api/borrowings/my"),
                apiconnect.getData("/api/reservations/my"),
            ]);

            const totalBooks = booksData.length;
            const myBorrowed = borrowingsData.filter(b => b.status === "BORROWED").length;
            const myReservations = reservationsData.filter(r => r.status === "WAITING").length;
            const myFines = borrowingsData.reduce((sum, b) => sum + (b.fineAmount || 0), 0);

            setStats({
                totalBooks,
                myBorrowed,
                myReservations,
                myFines,
            });

            setRecentBorrowings(borrowingsData.slice(0, 5));
            setRecentReservations(reservationsData.slice(0, 5));
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="admin-dashboard">Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-stats-grid">
                <div className="admin-stat-card admin-stat-books">
                    <span className="admin-stat-label">Total Books</span>
                    <span className="admin-stat-value">{stats.totalBooks}</span>
                    <span className="admin-stat-note">In library</span>
                </div>
                <div className="admin-stat-card admin-stat-borrowed">
                    <span className="admin-stat-label">My Borrowed</span>
                    <span className="admin-stat-value">{stats.myBorrowed}</span>
                    <span className="admin-stat-note">Currently reading</span>
                </div>
                <div className="admin-stat-card admin-stat-fines">
                    <span className="admin-stat-label">My Reservations</span>
                    <span className="admin-stat-value">{stats.myReservations}</span>
                    <span className="admin-stat-note">Waiting for books</span>
                </div>
                <div className="admin-stat-card admin-stat-overdue">
                    <span className="admin-stat-label">My Fines</span>
                    <span className="admin-stat-value">Rs. {stats.myFines}</span>
                    <span className="admin-stat-note">Pending fines</span>
                </div>
            </div>

            <div className="admin-dashboard-panels">
                <section className="admin-panel">
                    <h2 className="admin-panel-title">Quick Actions</h2>
                    <div className="admin-quick-actions">
                        <button className="admin-btn admin-btn-primary">Browse Books</button>
                        <button className="admin-btn admin-btn-primary">My Reservations</button>
                        <button className="admin-btn admin-btn-primary">My Due Books</button>
                    </div>
                </section>

                <section className="admin-panel">
                    <h2 className="admin-panel-title">Recent Borrowings</h2>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Borrowed Date</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBorrowings.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                            No recent borrowings
                                        </td>
                                    </tr>
                                ) : (
                                    recentBorrowings.map((borrowing) => (
                                        <tr key={borrowing.id}>
                                            <td>{borrowing.bookTitle}</td>
                                            <td>{borrowing.borrowDate || "-"}</td>
                                            <td>{borrowing.dueDate || "-"}</td>
                                            <td>
                                                <span className={`admin-badge admin-badge-${borrowing.status === "BORROWED" ? "available" : "unavailable"}`}>
                                                    {borrowing.status}
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
                    <h2 className="admin-panel-title">Recent Reservations</h2>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Reservation Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentReservations.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                                            No recent reservations
                                        </td>
                                    </tr>
                                ) : (
                                    recentReservations.map((reservation) => (
                                        <tr key={reservation.id}>
                                            <td>{reservation.bookTitle}</td>
                                            <td>{new Date(reservation.reservationDate).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`admin-badge admin-badge-${reservation.status === "WAITING" ? "borrowed" : "available"}`}>
                                                    {reservation.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
