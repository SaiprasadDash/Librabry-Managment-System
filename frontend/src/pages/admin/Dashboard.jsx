const stats = [
    { label: "Total Books", value: 1250, note: "86 added this month", type: "books" },
    { label: "Total Members", value: 342, note: "12 joined this week", type: "members" },
    { label: "Books Borrowed", value: 187, note: "Currently issued", type: "borrowed" },
    { label: "Overdue Books", value: 23, note: "Rs. 1,150 in pending fines", type: "overdue" },
];

const recentBorrowings = [
    { id: 1, book: "Clean Code", member: "Rahul Sharma", borrowedOn: "2026-11-18", dueDate: "2026-12-02", status: "Borrowed" },
    { id: 2, book: "The Pragmatic Programmer", member: "Priya Patel", borrowedOn: "2026-11-15", dueDate: "2026-11-29", status: "Borrowed" },
    { id: 3, book: "Introduction to Algorithms", member: "Amit Kumar", borrowedOn: "2026-11-01", dueDate: "2026-11-15", status: "Overdue" },
    { id: 4, book: "Design Patterns", member: "Sneha Das", borrowedOn: "2026-11-05", dueDate: "2026-11-19", status: "Returned" },
    { id: 5, book: "Effective Java", member: "Vikram Singh", borrowedOn: "2026-10-28", dueDate: "2026-11-11", status: "Overdue" },
];

const overdueBooks = [
    { id: 1, book: "Effective Java", member: "Vikram Singh", daysOverdue: 10, fine: 100 },
    { id: 2, book: "Introduction to Algorithms", member: "Amit Kumar", daysOverdue: 6, fine: 60 },
    { id: 3, book: "Head First Java", member: "Neha Gupta", daysOverdue: 4, fine: 40 },
];

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h1>Dashboard</h1>
                <p>Overview of the library at a glance</p>
            </div>

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
                                {recentBorrowings.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.book}</td>
                                        <td>{record.member}</td>
                                        <td>{record.borrowedOn}</td>
                                        <td>{record.dueDate}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${record.status.toLowerCase()}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="admin-panel">
                    <h2 className="admin-panel-title">Overdue Books</h2>
                    <ul className="admin-overdue-list">
                        {overdueBooks.map((item) => (
                            <li key={item.id} className="admin-overdue-item">
                                <div>
                                    <p className="admin-overdue-book">{item.book}</p>
                                    <p className="admin-overdue-member">{item.member}</p>
                                </div>
                                <div className="admin-overdue-meta">
                                    <span className="admin-overdue-days">{item.daysOverdue} days</span>
                                    <span className="admin-overdue-fine">Rs. {item.fine}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default AdminDashboard;
