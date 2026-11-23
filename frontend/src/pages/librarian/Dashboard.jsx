function LibrarianDashboard() {
    const stats = [
        { label: "Total Books", value: 1250, note: "Library collection", type: "books" },
        { label: "Total Members", value: 342, note: "Registered users", type: "members" },
        { label: "Currently Borrowed", value: 89, note: "Books issued", type: "borrowed" },
        { label: "Overdue Books", value: 12, note: "Rs. 450 in fines", type: "overdue" },
        { label: "Pending Fines", value: 450, note: "From 12 members", type: "fines" },
    ];

    const recentBorrowings = [
        { id: 1, book: "The Great Gatsby", member: "John Doe", borrowedOn: "2024-01-15", dueDate: "2024-01-29", status: "Active" },
        { id: 2, book: "To Kill a Mockingbird", member: "Jane Smith", borrowedOn: "2024-01-14", dueDate: "2024-01-28", status: "Active" },
        { id: 3, book: "1984", member: "Bob Johnson", borrowedOn: "2024-01-13", dueDate: "2024-01-27", status: "Overdue" },
    ];

    const recentReturns = [
        { id: 1, book: "Pride and Prejudice", member: "Alice Brown", returnedOn: "2024-01-15", condition: "Good" },
        { id: 2, book: "The Catcher in the Rye", member: "Charlie Davis", returnedOn: "2024-01-14", condition: "Good" },
        { id: 3, book: "Brave New World", member: "Diana Evans", returnedOn: "2024-01-13", condition: "Damaged" },
    ];

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
                        <button className="admin-btn admin-btn-primary">Issue Book</button>
                        <button className="admin-btn admin-btn-primary">Return Book</button>
                        <button className="admin-btn admin-btn-primary">Add Book</button>
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
                    <h2 className="admin-panel-title">Recently Returned Books</h2>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Member</th>
                                    <th>Returned On</th>
                                    <th>Condition</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentReturns.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.book}</td>
                                        <td>{record.member}</td>
                                        <td>{record.returnedOn}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${record.condition === "Good" ? "available" : "unavailable"}`}>
                                                {record.condition}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default LibrarianDashboard;
