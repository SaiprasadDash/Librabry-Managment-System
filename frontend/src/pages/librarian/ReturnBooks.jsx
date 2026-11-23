import { useState } from "react";

function ReturnBooks() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const borrowingRecords = [
        {
            id: 1,
            member: { id: 1, name: "John Doe", email: "john.doe@example.com" },
            book: { id: 1, title: "The Great Gatsby", isbn: "978-0743273565" },
            borrowedDate: "2024-01-10",
            dueDate: "2024-01-24",
            status: "Active",
        },
        {
            id: 2,
            member: { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
            book: { id: 2, title: "To Kill a Mockingbird", isbn: "978-0061120084" },
            borrowedDate: "2024-01-05",
            dueDate: "2024-01-19",
            status: "Overdue",
        },
        {
            id: 3,
            member: { id: 4, name: "Alice Brown", email: "alice.brown@example.com" },
            book: { id: 4, title: "Pride and Prejudice", isbn: "978-0141439518" },
            borrowedDate: "2024-01-15",
            dueDate: "2024-01-29",
            status: "Active",
        },
        {
            id: 4,
            member: { id: 1, name: "John Doe", email: "john.doe@example.com" },
            book: { id: 5, title: "The Catcher in the Rye", isbn: "978-0316769488" },
            borrowedDate: "2023-12-20",
            dueDate: "2024-01-03",
            status: "Overdue",
        },
    ];

    const calculateOverdueDays = (dueDate) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const calculateFine = (overdueDays) => {
        return overdueDays * 5; // Rs. 5 per day
    };

    const filteredRecords = borrowingRecords.filter((record) =>
        record.member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.book.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleReturn = (record) => {
        setSelectedRecord(record);
        setShowConfirmModal(true);
    };

    const confirmReturn = () => {
        if (selectedRecord) {
            console.log("Return Book:", selectedRecord);
            alert("Book returned successfully!");
            setShowConfirmModal(false);
            setSelectedRecord(null);
        }
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "active": return "available";
            case "overdue": return "overdue";
            case "returned": return "active";
            default: return "inactive";
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-filters">
                <div className="admin-search-box">
                    <input
                        type="text"
                        placeholder="Search by member name, email, or book title..."
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
                                <th>Member</th>
                                <th>Email</th>
                                <th>Book</th>
                                <th>ISBN</th>
                                <th>Borrowed Date</th>
                                <th>Due Date</th>
                                <th>Overdue Days</th>
                                <th>Fine</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                                        No borrowing records found
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => {
                                    const overdueDays = calculateOverdueDays(record.dueDate);
                                    const fine = calculateFine(overdueDays);
                                    return (
                                        <tr key={record.id}>
                                            <td>#{record.id}</td>
                                            <td className="admin-book-title">{record.member.name}</td>
                                            <td>{record.member.email}</td>
                                            <td>{record.book.title}</td>
                                            <td className="admin-isbn">{record.book.isbn}</td>
                                            <td>{record.borrowedDate}</td>
                                            <td className={overdueDays > 0 ? "admin-due-date" : ""}>{record.dueDate}</td>
                                            <td>
                                                <span className={overdueDays > 0 ? "admin-fine-amount" : "admin-fine-zero"}>
                                                    {overdueDays} days
                                                </span>
                                            </td>
                                            <td className={fine > 0 ? "admin-fine-amount" : "admin-fine-zero"}>
                                                Rs. {fine}
                                            </td>
                                            <td>
                                                <span className={`admin-badge admin-badge-${getStatusClass(record.status)}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admin-action-buttons">
                                                    <button
                                                        className="admin-btn admin-btn-return"
                                                        onClick={() => handleReturn(record)}
                                                    >
                                                        Return
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span className="admin-pagination-info">
                        Showing {filteredRecords.length} of {borrowingRecords.length} records
                    </span>
                </div>
            </section>

            {showConfirmModal && selectedRecord && (
                <div className="admin-modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Confirm Book Return</h2>
                            <button className="admin-modal-close" onClick={() => setShowConfirmModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Member:</span>
                                <span className="admin-detail-value">{selectedRecord.member.name}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Book:</span>
                                <span className="admin-detail-value">{selectedRecord.book.title}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Borrowed Date:</span>
                                <span className="admin-detail-value">{selectedRecord.borrowedDate}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Due Date:</span>
                                <span className="admin-detail-value">{selectedRecord.dueDate}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Overdue Days:</span>
                                <span className="admin-detail-value">
                                    {calculateOverdueDays(selectedRecord.dueDate)} days
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Fine Amount:</span>
                                <span className="admin-detail-value admin-fine-amount">
                                    Rs. {calculateFine(calculateOverdueDays(selectedRecord.dueDate))}
                                </span>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button
                                className="admin-btn admin-btn-secondary"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="admin-btn admin-btn-primary"
                                onClick={confirmReturn}
                            >
                                Confirm Return
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReturnBooks;
