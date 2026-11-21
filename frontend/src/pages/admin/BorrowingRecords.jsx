const borrowings = [
    { id: 1, book: "Clean Code", bookId: "BK001", member: "Rahul Sharma", memberId: "MEM001", borrowedOn: "2026-11-18", dueDate: "2026-12-02", returnedDate: null, status: "Borrowed", fine: 0 },
    { id: 2, book: "The Pragmatic Programmer", bookId: "BK002", member: "Priya Patel", memberId: "MEM002", borrowedOn: "2026-11-15", dueDate: "2026-11-29", returnedDate: null, status: "Borrowed", fine: 0 },
    { id: 3, book: "Introduction to Algorithms", bookId: "BK003", member: "Amit Kumar", memberId: "MEM003", borrowedOn: "2026-11-01", dueDate: "2026-11-15", returnedDate: null, status: "Overdue", fine: 60 },
    { id: 4, book: "Design Patterns", bookId: "BK004", member: "Sneha Das", memberId: "MEM004", borrowedOn: "2026-11-05", dueDate: "2026-11-19", returnedDate: "2026-11-18", status: "Returned", fine: 0 },
    { id: 5, book: "Effective Java", bookId: "BK005", member: "Vikram Singh", memberId: "MEM005", borrowedOn: "2026-10-28", dueDate: "2026-11-11", returnedDate: null, status: "Overdue", fine: 100 },
    { id: 6, book: "Head First Java", bookId: "BK006", member: "Neha Gupta", memberId: "MEM006", borrowedOn: "2026-10-25", dueDate: "2026-11-08", returnedDate: "2026-11-07", status: "Returned", fine: 0 },
    { id: 7, book: "Refactoring", bookId: "BK007", member: "Rahul Sharma", memberId: "MEM001", borrowedOn: "2026-10-20", dueDate: "2026-11-03", returnedDate: "2026-11-02", status: "Returned", fine: 0 },
    { id: 8, book: "The C Programming Language", bookId: "BK008", member: "Priya Patel", memberId: "MEM002", borrowedOn: "2026-11-10", dueDate: "2026-11-24", returnedDate: null, status: "Borrowed", fine: 0 },
];

function BorrowingRecords() {
    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h1>Borrowing Records</h1>
                <p>View and manage all book borrowing records</p>
            </div>

            <div className="admin-filters">
                <div className="admin-search-box">
                    <input type="text" placeholder="Search by book, member, or ID..." className="admin-search-input" />
                    <button className="admin-search-btn">Search</button>
                </div>
                <div className="admin-filter-options">
                    <select className="admin-filter-select">
                        <option value="">All Status</option>
                        <option value="borrowed">Borrowed</option>
                        <option value="returned">Returned</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <input type="date" className="admin-filter-select" />
                    <input type="date" className="admin-filter-select" />
                </div>
                <button className="admin-btn admin-btn-primary">Export Records</button>
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
                                <th>Returned Date</th>
                                <th>Status</th>
                                <th>Fine</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowings.map((record) => (
                                <tr key={record.id}>
                                    <td>#{record.id}</td>
                                    <td className="admin-book-title">{record.book}</td>
                                    <td className="admin-isbn">{record.bookId}</td>
                                    <td>{record.member}</td>
                                    <td className="admin-isbn">{record.memberId}</td>
                                    <td>{record.borrowedOn}</td>
                                    <td>{record.dueDate}</td>
                                    <td>{record.returnedDate || "-"}</td>
                                    <td>
                                        <span className={`admin-badge admin-badge-${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td>
                                        {record.fine > 0 ? (
                                            <span className="admin-fine-amount">Rs. {record.fine}</span>
                                        ) : (
                                            <span className="admin-fine-zero">Rs. 0</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="admin-action-buttons">
                                            <button className="admin-btn-icon admin-btn-view" title="View Details">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </button>
                                            {record.status === "Borrowed" && (
                                                <button className="admin-btn-icon admin-btn-return" title="Mark as Returned">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="9 14 4 9 9 4"></polyline>
                                                        <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span className="admin-pagination-info">Showing 1-8 of 8 records</span>
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

export default BorrowingRecords;
