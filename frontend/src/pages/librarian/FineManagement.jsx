import { useState } from "react";

function FineManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedFine, setSelectedFine] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");

    const fineRecords = [
        {
            id: 1,
            member: { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
            book: { id: 2, title: "To Kill a Mockingbird", isbn: "978-0061120084" },
            borrowedDate: "2024-01-05",
            dueDate: "2024-01-19",
            overdueDays: 5,
            totalFine: 25,
            paidAmount: 0,
            pendingAmount: 25,
            status: "Unpaid",
            paymentHistory: [],
        },
        {
            id: 2,
            member: { id: 1, name: "John Doe", email: "john.doe@example.com" },
            book: { id: 5, title: "The Catcher in the Rye", isbn: "978-0316769488" },
            borrowedDate: "2023-12-20",
            dueDate: "2024-01-03",
            overdueDays: 21,
            totalFine: 105,
            paidAmount: 50,
            pendingAmount: 55,
            status: "Partial",
            paymentHistory: [
                { id: 1, amount: 50, date: "2024-01-10", method: "Cash" },
            ],
        },
        {
            id: 3,
            member: { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" },
            book: { id: 3, title: "1984", isbn: "978-0451524935" },
            borrowedDate: "2023-12-25",
            dueDate: "2024-01-08",
            overdueDays: 16,
            totalFine: 80,
            paidAmount: 80,
            pendingAmount: 0,
            status: "Paid",
            paymentHistory: [
                { id: 1, amount: 80, date: "2024-01-15", method: "Online" },
            ],
        },
        {
            id: 4,
            member: { id: 4, name: "Alice Brown", email: "alice.brown@example.com" },
            book: { id: 1, title: "The Great Gatsby", isbn: "978-0743273565" },
            borrowedDate: "2024-01-02",
            dueDate: "2024-01-16",
            overdueDays: 8,
            totalFine: 40,
            paidAmount: 0,
            pendingAmount: 40,
            status: "Unpaid",
            paymentHistory: [],
        },
        {
            id: 5,
            member: { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
            book: { id: 4, title: "Pride and Prejudice", isbn: "978-0141439518" },
            borrowedDate: "2023-11-15",
            dueDate: "2023-11-29",
            overdueDays: 55,
            totalFine: 275,
            paidAmount: 200,
            pendingAmount: 75,
            status: "Partial",
            paymentHistory: [
                { id: 1, amount: 100, date: "2023-12-10", method: "Cash" },
                { id: 2, amount: 100, date: "2023-12-20", method: "Online" },
            ],
        },
    ];

    const stats = {
        totalPendingFines: fineRecords.reduce((sum, r) => sum + r.pendingAmount, 0),
        totalPaidFines: fineRecords.reduce((sum, r) => sum + r.paidAmount, 0),
        totalFines: fineRecords.reduce((sum, r) => sum + r.totalFine, 0),
        unpaidCount: fineRecords.filter(r => r.status === "Unpaid").length,
    };

    const filteredFines = fineRecords.filter((record) => {
        const matchesSearch =
            record.member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.book.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !statusFilter || record.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "paid": return "paid";
            case "partial": return "borrowed";
            case "unpaid": return "unpaid";
            default: return "inactive";
        }
    };

    const handleRecordPayment = (fine) => {
        setSelectedFine(fine);
        setPaymentAmount(fine.pendingAmount.toString());
        setShowPaymentModal(true);
    };

    const handleViewHistory = (fine) => {
        setSelectedFine(fine);
        setShowHistoryModal(true);
    };

    const confirmPayment = (e) => {
        e.preventDefault();
        const amount = parseFloat(paymentAmount);
        if (amount <= 0 || amount > selectedFine.pendingAmount) {
            alert("Invalid payment amount");
            return;
        }
        console.log("Record Payment:", {
            fineId: selectedFine.id,
            amount,
            member: selectedFine.member.name,
        });
        alert(`Payment of Rs. ${amount} recorded successfully!`);
        setShowPaymentModal(false);
        setSelectedFine(null);
        setPaymentAmount("");
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-stats-grid">
                <div className="admin-stat-card admin-stat-pending">
                    <span className="admin-stat-label">Total Pending Fines</span>
                    <span className="admin-stat-value">Rs. {stats.totalPendingFines}</span>
                    <span className="admin-stat-note">From {fineRecords.filter(r => r.pendingAmount > 0).length} members</span>
                </div>
                <div className="admin-stat-card admin-stat-collected">
                    <span className="admin-stat-label">Total Paid Fines</span>
                    <span className="admin-stat-value">Rs. {stats.totalPaidFines}</span>
                    <span className="admin-stat-note">Collected payments</span>
                </div>
                <div className="admin-stat-card admin-stat-average">
                    <span className="admin-stat-label">Total Fines</span>
                    <span className="admin-stat-value">Rs. {stats.totalFines}</span>
                    <span className="admin-stat-note">All time</span>
                </div>
                <div className="admin-stat-card admin-stat-overdue">
                    <span className="admin-stat-label">Unpaid Records</span>
                    <span className="admin-stat-value">{stats.unpaidCount}</span>
                    <span className="admin-stat-note">Awaiting payment</span>
                </div>
            </div>

            <div className="admin-filters">
                <div className="admin-search-box">
                    <input
                        type="text"
                        placeholder="Search by member name or book title..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="admin-search-btn">Search</button>
                </div>
                <div className="admin-filter-options">
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Unpaid">Unpaid</option>
                    </select>
                </div>
            </div>

            <section className="admin-panel">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Member</th>
                                <th>Book</th>
                                <th>Overdue Days</th>
                                <th>Total Fine</th>
                                <th>Paid</th>
                                <th>Pending</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFines.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                                        No fine records found
                                    </td>
                                </tr>
                            ) : (
                                filteredFines.map((record) => (
                                    <tr key={record.id}>
                                        <td>#{record.id}</td>
                                        <td className="admin-book-title">{record.member.name}</td>
                                        <td>{record.book.title}</td>
                                        <td className="admin-fine-amount">{record.overdueDays} days</td>
                                        <td>Rs. {record.totalFine}</td>
                                        <td className="admin-fine-zero">Rs. {record.paidAmount}</td>
                                        <td className={record.pendingAmount > 0 ? "admin-fine-amount" : "admin-fine-zero"}>
                                            Rs. {record.pendingAmount}
                                        </td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${getStatusClass(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-action-buttons">
                                                <button
                                                    className="admin-btn-icon admin-btn-pay"
                                                    title="Record Payment"
                                                    onClick={() => handleRecordPayment(record)}
                                                    disabled={record.pendingAmount === 0}
                                                    style={{ opacity: record.pendingAmount === 0 ? 0.5 : 1 }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                                                        <line x1="2" y1="10" x2="22" y2="10"></line>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="admin-btn-icon admin-btn-view"
                                                    title="View History"
                                                    onClick={() => handleViewHistory(record)}
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
                        Showing {filteredFines.length} of {fineRecords.length} fine records
                    </span>
                </div>
            </section>

            {/* Payment Modal */}
            {showPaymentModal && selectedFine && (
                <div className="admin-modal-overlay" onClick={() => setShowPaymentModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Record Fine Payment</h2>
                            <button className="admin-modal-close" onClick={() => setShowPaymentModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Member:</span>
                                <span className="admin-detail-value">{selectedFine.member.name}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Book:</span>
                                <span className="admin-detail-value">{selectedFine.book.title}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Total Fine:</span>
                                <span className="admin-detail-value">Rs. {selectedFine.totalFine}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Already Paid:</span>
                                <span className="admin-detail-value admin-fine-zero">Rs. {selectedFine.paidAmount}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Pending Amount:</span>
                                <span className="admin-detail-value admin-fine-amount">Rs. {selectedFine.pendingAmount}</span>
                            </div>
                        </div>
                        <form onSubmit={confirmPayment} className="admin-modal-form">
                            <div className="admin-form-group">
                                <label>Payment Amount *</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    min="1"
                                    max={selectedFine.pendingAmount}
                                    required
                                />
                                <small style={{ color: "var(--text)", fontSize: "12px" }}>
                                    Maximum: Rs. {selectedFine.pendingAmount}
                                </small>
                            </div>
                            <div className="admin-form-group">
                                <label>Payment Method</label>
                                <select defaultValue="Cash">
                                    <option value="Cash">Cash</option>
                                    <option value="Online">Online</option>
                                    <option value="Card">Card</option>
                                </select>
                            </div>
                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn-primary"
                                >
                                    Record Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment History Modal */}
            {showHistoryModal && selectedFine && (
                <div className="admin-modal-overlay" onClick={() => setShowHistoryModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
                        <div className="admin-modal-header">
                            <h2>Payment History</h2>
                            <button className="admin-modal-close" onClick={() => setShowHistoryModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Member:</span>
                                <span className="admin-detail-value">{selectedFine.member.name}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Book:</span>
                                <span className="admin-detail-value">{selectedFine.book.title}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Total Fine:</span>
                                <span className="admin-detail-value">Rs. {selectedFine.totalFine}</span>
                            </div>
                        </div>
                        <div className="admin-modal-header" style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                            <h2>Payment Records</h2>
                        </div>
                        <div className="admin-modal-form" style={{ paddingTop: 0 }}>
                            {selectedFine.paymentHistory.length === 0 ? (
                                <p style={{ textAlign: "center", color: "var(--text)", padding: "20px" }}>
                                    No payment history
                                </p>
                            ) : (
                                <div className="admin-table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>Method</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedFine.paymentHistory.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td>{payment.date}</td>
                                                    <td className="admin-fine-zero">Rs. {payment.amount}</td>
                                                    <td>{payment.method}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            <button
                                className="admin-btn admin-btn-secondary"
                                onClick={() => setShowHistoryModal(false)}
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

export default FineManagement;
