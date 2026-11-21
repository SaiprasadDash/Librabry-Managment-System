const overdueBooks = [
    { id: 1, book: "Effective Java", bookId: "BK005", member: "Vikram Singh", memberId: "MEM005", borrowedOn: "2026-10-28", dueDate: "2026-11-11", daysOverdue: 10, finePerDay: 10, totalFine: 100, status: "Unpaid", paidDate: null },
    { id: 2, book: "Introduction to Algorithms", bookId: "BK003", member: "Amit Kumar", memberId: "MEM003", borrowedOn: "2026-11-01", dueDate: "2026-11-15", daysOverdue: 6, finePerDay: 10, totalFine: 60, status: "Unpaid", paidDate: null },
    { id: 3, book: "Head First Java", bookId: "BK006", member: "Neha Gupta", memberId: "MEM006", borrowedOn: "2026-10-15", dueDate: "2026-10-29", daysOverdue: 23, finePerDay: 10, totalFine: 230, status: "Paid", paidDate: "2026-11-10" },
    { id: 4, book: "Design Patterns", bookId: "BK004", member: "Suresh Reddy", memberId: "MEM007", borrowedOn: "2026-10-20", dueDate: "2026-11-03", daysOverdue: 18, finePerDay: 10, totalFine: 180, status: "Unpaid", paidDate: null },
    { id: 5, book: "Refactoring", bookId: "BK007", member: "Anita Desai", memberId: "MEM008", borrowedOn: "2026-10-25", dueDate: "2026-11-08", daysOverdue: 13, finePerDay: 10, totalFine: 130, status: "Paid", paidDate: "2026-11-15" },
];

const stats = [
    { label: "Total Overdue Books", value: 5, type: "overdue" },
    { label: "Total Fines Pending", value: "Rs. 540", type: "pending" },
    { label: "Total Fines Collected", value: "Rs. 360", type: "collected" },
    { label: "Average Days Overdue", value: 14, type: "average" },
];

function OverdueFines() {
    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h1>Overdue Books & Fines</h1>
                <p>Track overdue books and manage fine payments</p>
            </div>

            <div className="admin-stats-grid">
                {stats.map((stat) => (
                    <div key={stat.label} className={`admin-stat-card admin-stat-${stat.type}`}>
                        <span className="admin-stat-label">{stat.label}</span>
                        <span className="admin-stat-value">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="admin-filters">
                <div className="admin-search-box">
                    <input type="text" placeholder="Search by book, member, or ID..." className="admin-search-input" />
                    <button className="admin-search-btn">Search</button>
                </div>
                <div className="admin-filter-options">
                    <select className="admin-filter-select">
                        <option value="">All Status</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                    </select>
                    <select className="admin-filter-select">
                        <option value="">Sort By</option>
                        <option value="days">Days Overdue</option>
                        <option value="fine">Fine Amount</option>
                        <option value="date">Due Date</option>
                    </select>
                </div>
                <button className="admin-btn admin-btn-primary">Send Reminders</button>
            </div>

            <section className="admin-panel">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Book</th>
                                <th>Book ID</th>
                                <th>Member</th>
                                <th>Member ID</th>
                                <th>Borrowed On</th>
                                <th>Due Date</th>
                                <th>Days Overdue</th>
                                <th>Fine/Day</th>
                                <th>Total Fine</th>
                                <th>Status</th>
                                <th>Paid Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overdueBooks.map((record) => (
                                <tr key={record.id}>
                                    <td>#{record.id}</td>
                                    <td className="admin-book-title">{record.book}</td>
                                    <td className="admin-isbn">{record.bookId}</td>
                                    <td>{record.member}</td>
                                    <td className="admin-isbn">{record.memberId}</td>
                                    <td>{record.borrowedOn}</td>
                                    <td className="admin-due-date">{record.dueDate}</td>
                                    <td>
                                        <span className="admin-overdue-days">{record.daysOverdue} days</span>
                                    </td>
                                    <td>Rs. {record.finePerDay}</td>
                                    <td>
                                        <span className="admin-fine-amount">Rs. {record.totalFine}</span>
                                    </td>
                                    <td>
                                        <span className={`admin-badge admin-badge-${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td>{record.paidDate || "-"}</td>
                                    <td>
                                        <div className="admin-action-buttons">
                                            <button className="admin-btn-icon admin-btn-view" title="View Details">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </button>
                                            {record.status === "Unpaid" && (
                                                <button className="admin-btn-icon admin-btn-pay" title="Mark as Paid">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                                                        <line x1="2" y1="10" x2="22" y2="10"></line>
                                                    </svg>
                                                </button>
                                            )}
                                            <button className="admin-btn-icon admin-btn-notify" title="Send Reminder">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span className="admin-pagination-info">Showing 1-5 of 5 overdue records</span>
                    <div className="admin-pagination-controls">
                        <button className="admin-btn admin-btn-secondary" disabled>Previous</button>
                        <button className="admin-btn admin-btn-secondary admin-btn-active">1</button>
                        <button className="admin-btn admin-btn-secondary" disabled>Next</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default OverdueFines;
