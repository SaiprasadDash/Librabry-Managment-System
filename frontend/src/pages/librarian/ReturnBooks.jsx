
import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function ReturnBooks() {
    const [searchTerm, setSearchTerm] = useState("");
    const [borrowingRecords, setBorrowingRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [returning, setReturning] = useState(false);

    useEffect(() => {
        fetchPendingReturns();
    }, []);

    // Fetch only pending return requests
    const fetchPendingReturns = async () => {
        try {
            setLoading(true);

            const data = await apiconnect.getData(
                "/api/borrowings/return-requests"
            );

            setBorrowingRecords(data);

        } catch (error) {
            console.error("Failed to fetch pending returns:", error);
            alert("Failed to load pending return requests");
        } finally {
            setLoading(false);
        }
    };

    const calculateOverdueDays = (dueDate) => {
        if (!dueDate) return 0;

        const due = new Date(dueDate + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffTime = today - due;
        const diffDays = Math.floor(
            diffTime / (1000 * 60 * 60 * 24)
        );

        return Math.max(0, diffDays);
    };

    const calculateFine = (record) => {
        return record.fineAmount || 0;
    };

    const filteredRecords = borrowingRecords.filter((record) =>
        record.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleReturn = (record) => {
        setSelectedRecord(record);
        setShowConfirmModal(true);
    };

    // Librarian confirms the return
    const confirmReturn = async () => {
        if (!selectedRecord) return;

        try {
            setReturning(true);

            await apiconnect.putData(
                `/api/borrowings/${selectedRecord.id}/return/librarian`,
                {}
            );

            alert("Book return confirmed successfully!");

            setShowConfirmModal(false);
            setSelectedRecord(null);

            await fetchPendingReturns();

        } catch (error) {
            console.error("Failed to confirm return:", error);

            alert(
                error?.response?.data?.message ||
                "Failed to confirm book return. Please try again."
            );
        } finally {
            setReturning(false);
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

                    <button className="admin-search-btn">
                        Search
                    </button>
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

                            {loading ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                                        Loading pending return requests...
                                    </td>
                                </tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                                        No pending return requests found
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => {
                                    const overdueDays = calculateOverdueDays(record.dueDate);
                                    const fine = calculateFine(record);

                                    return (
                                        <tr key={record.id}>

                                            <td>#{record.id}</td>

                                            <td className="admin-book-title">
                                                {record.userName}
                                            </td>

                                            <td>{record.userEmail}</td>

                                            <td>{record.bookTitle}</td>

                                            <td className="admin-isbn">
                                                {record.isbn}
                                            </td>

                                            <td>{record.borrowDate}</td>

                                            <td className={overdueDays > 0 ? "admin-due-date" : ""}>
                                                {record.dueDate}
                                            </td>

                                            <td>
                                                <span className={
                                                    overdueDays > 0
                                                        ? "admin-fine-amount"
                                                        : "admin-fine-zero"
                                                }>
                                                    {overdueDays} days
                                                </span>
                                            </td>

                                            <td className={
                                                fine > 0
                                                    ? "admin-fine-amount"
                                                    : "admin-fine-zero"
                                            }>
                                                Rs. {fine}
                                            </td>

                                            <td>
                                                <span className="admin-badge admin-badge-overdue">
                                                    Return Pending
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-action-buttons">
                                                    <button
                                                        className="admin-btn admin-btn-return"
                                                        onClick={() => handleReturn(record)}
                                                    >
                                                        Confirm Return
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
                        Showing {filteredRecords.length} of {borrowingRecords.length} pending requests
                    </span>
                </div>

            </section>

            {showConfirmModal && selectedRecord && (
                <div
                    className="admin-modal-overlay"
                    onClick={() => !returning && setShowConfirmModal(false)}
                >

                    <div
                        className="admin-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="admin-modal-header">
                            <h2>Confirm Book Return</h2>

                            <button
                                className="admin-modal-close"
                                disabled={returning}
                                onClick={() => setShowConfirmModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-modal-content">

                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Member:</span>
                                <span className="admin-detail-value">
                                    {selectedRecord.userName}
                                </span>
                            </div>

                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Book:</span>
                                <span className="admin-detail-value">
                                    {selectedRecord.bookTitle}
                                </span>
                            </div>

                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Borrowed Date:</span>
                                <span className="admin-detail-value">
                                    {selectedRecord.borrowDate}
                                </span>
                            </div>

                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Due Date:</span>
                                <span className="admin-detail-value">
                                    {selectedRecord.dueDate}
                                </span>
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
                                    Rs. {calculateFine(selectedRecord)}
                                </span>
                            </div>

                            <p>
                                Are you sure you have received this physical book?
                                Confirming will officially complete the return.
                            </p>

                        </div>

                        <div className="admin-modal-footer">

                            <button
                                className="admin-btn admin-btn-secondary"
                                disabled={returning}
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="admin-btn admin-btn-primary"
                                onClick={confirmReturn}
                                disabled={returning}
                            >
                                {returning ? "Confirming..." : "Confirm Return"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default ReturnBooks;
