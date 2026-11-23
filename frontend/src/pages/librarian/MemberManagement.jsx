import { useState } from "react";

function MemberManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingMember, setViewingMember] = useState(null);

    const members = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "555-0101",
            joinedDate: "2023-06-15",
            status: "Active",
            totalBorrowed: 5,
            currentlyBorrowed: 2,
            overdueBooks: 0,
            fines: 0,
            borrowingHistory: [
                { id: 1, book: "The Great Gatsby", borrowedDate: "2024-01-10", dueDate: "2024-01-24", returnedDate: "2024-01-20", status: "Returned" },
                { id: 2, book: "To Kill a Mockingbird", borrowedDate: "2024-01-15", dueDate: "2024-01-29", returnedDate: null, status: "Active" },
                { id: 3, book: "1984", borrowedDate: "2024-01-18", dueDate: "2024-02-01", returnedDate: null, status: "Active" },
            ],
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "555-0102",
            joinedDate: "2023-08-20",
            status: "Active",
            totalBorrowed: 8,
            currentlyBorrowed: 1,
            overdueBooks: 1,
            fines: 50,
            borrowingHistory: [
                { id: 1, book: "Pride and Prejudice", borrowedDate: "2024-01-05", dueDate: "2024-01-19", returnedDate: null, status: "Overdue" },
                { id: 2, book: "The Catcher in the Rye", borrowedDate: "2024-01-10", dueDate: "2024-01-24", returnedDate: "2024-01-22", status: "Returned" },
            ],
        },
        {
            id: 3,
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
            phone: "555-0103",
            joinedDate: "2023-09-10",
            status: "Suspended",
            totalBorrowed: 3,
            currentlyBorrowed: 0,
            overdueBooks: 0,
            fines: 150,
            borrowingHistory: [
                { id: 1, book: "Brave New World", borrowedDate: "2023-12-01", dueDate: "2023-12-15", returnedDate: "2023-12-20", status: "Returned Late" },
            ],
        },
    ];

    const filteredMembers = members.filter((member) =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (member) => {
        setViewingMember(member);
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "active": return "active";
            case "suspended": return "suspended";
            case "inactive": return "inactive";
            default: return "inactive";
        }
    };

    const getBorrowingStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "active": return "available";
            case "returned": return "active";
            case "overdue": return "overdue";
            case "returned late": return "borrowed";
            default: return "inactive";
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-filters">
                <div className="admin-search-box">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="admin-search-btn">Search</button>
                </div>
            </div>

            <section className="admin-panel">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Joined Date</th>
                                <th>Status</th>
                                <th>Borrowed</th>
                                <th>Overdue</th>
                                <th>Fines</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                                        No members found
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map((member) => (
                                    <tr key={member.id}>
                                        <td>#{member.id}</td>
                                        <td className="admin-book-title">{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>{member.phone}</td>
                                        <td>{member.joinedDate}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${getStatusClass(member.status)}`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td>{member.currentlyBorrowed}/{member.totalBorrowed}</td>
                                        <td>{member.overdueBooks}</td>
                                        <td className={member.fines > 0 ? "admin-fine-amount" : "admin-fine-zero"}>
                                            Rs. {member.fines}
                                        </td>
                                        <td>
                                            <div className="admin-action-buttons">
                                                <button
                                                    className="admin-btn-icon admin-btn-view"
                                                    title="View Details"
                                                    onClick={() => handleView(member)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span className="admin-pagination-info">
                        Showing {filteredMembers.length} of {members.length} members
                    </span>
                </div>
            </section>

            {viewingMember && (
                <div className="admin-modal-overlay" onClick={() => setViewingMember(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
                        <div className="admin-modal-header">
                            <h2>Member Details</h2>
                            <button className="admin-modal-close" onClick={() => setViewingMember(null)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Name:</span>
                                <span className="admin-detail-value">{viewingMember.name}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Email:</span>
                                <span className="admin-detail-value">{viewingMember.email}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Phone:</span>
                                <span className="admin-detail-value">{viewingMember.phone}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Joined Date:</span>
                                <span className="admin-detail-value">{viewingMember.joinedDate}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Account Status:</span>
                                <span className={`admin-badge admin-badge-${getStatusClass(viewingMember.status)}`}>
                                    {viewingMember.status}
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Total Borrowed:</span>
                                <span className="admin-detail-value">{viewingMember.totalBorrowed}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Currently Borrowed:</span>
                                <span className="admin-detail-value">{viewingMember.currentlyBorrowed}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Overdue Books:</span>
                                <span className="admin-detail-value" style={{ color: viewingMember.overdueBooks > 0 ? "var(--status-error)" : "var(--text-h)" }}>
                                    {viewingMember.overdueBooks}
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Pending Fines:</span>
                                <span className="admin-detail-value" className={viewingMember.fines > 0 ? "admin-fine-amount" : "admin-fine-zero"}>
                                    Rs. {viewingMember.fines}
                                </span>
                            </div>
                        </div>

                        <div className="admin-modal-header" style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                            <h2>Borrowing History</h2>
                        </div>
                        <div className="admin-modal-form" style={{ paddingTop: 0 }}>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Book</th>
                                            <th>Borrowed Date</th>
                                            <th>Due Date</th>
                                            <th>Returned Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewingMember.borrowingHistory.map((record) => (
                                            <tr key={record.id}>
                                                <td>{record.book}</td>
                                                <td>{record.borrowedDate}</td>
                                                <td className={record.status === "Overdue" ? "admin-due-date" : ""}>{record.dueDate}</td>
                                                <td>{record.returnedDate || "-"}</td>
                                                <td>
                                                    <span className={`admin-badge admin-badge-${getBorrowingStatusClass(record.status)}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="admin-modal-footer">
                            <button
                                className="admin-btn admin-btn-secondary"
                                onClick={() => setViewingMember(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MemberManagement;
