import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function BorrowingHistory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [borrowingHistory, setBorrowingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBorrowingHistory();
    }, []);

    const fetchBorrowingHistory = async () => {
        try {
            setLoading(true);
            const data = await apiconnect.getData("/api/borrowings/all");
            setBorrowingHistory(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch borrowing history");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = borrowingHistory.filter((record) => {
        const matchesSearch =
            record.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = !dateFilter ||
            record.borrowDate === dateFilter ||
            record.returnDate === dateFilter;

        const matchesStatus = !statusFilter || record.status === statusFilter;

        return matchesSearch && matchesDate && matchesStatus;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case "BORROWED": return "available";
            case "RETURNED": return "active";
            case "OVERDUE": return "overdue";
            case "RETURNED_LATE": return "borrowed";
            default: return "inactive";
        }
    };

    const uniqueDates = [...new Set(borrowingHistory.flatMap(r => [r.borrowDate, r.returnDate].filter(Boolean)))].sort();
    const uniqueStatuses = [...new Set(borrowingHistory.map(r => r.status))];

    if (loading) {
        return <div className="admin-dashboard">Loading...</div>;
    }

    if (error) {
        return <div className="admin-dashboard">Error: {error}</div>;
    }

    return (
        <div className="admin-dashboard">
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
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="">All Dates</option>
                        {uniqueDates.map((date) => (
                            <option key={date} value={date}>
                                {date}
                            </option>
                        ))}
                    </select>
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        {uniqueStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
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
                                <th>Email</th>
                                <th>Book</th>
                                <th>ISBN</th>
                                <th>Borrowed Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                filteredHistory.map((record) => (
                                    <tr key={record.id}>
                                        <td>#{record.id}</td>
                                        <td className="admin-book-title">{record.userName}</td>
                                        <td>{record.userEmail}</td>
                                        <td>{record.bookTitle}</td>
                                        <td className="admin-isbn">{record.isbn}</td>
                                        <td>{record.borrowDate}</td>
                                        <td className={record.status === "OVERDUE" ? "admin-due-date" : ""}>{record.dueDate}</td>
                                        <td>{record.returnDate || "-"}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${getStatusClass(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className={record.fineAmount > 0 ? "admin-fine-amount" : "admin-fine-zero"}>
                                            Rs. {record.fineAmount}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span className="admin-pagination-info">
                        Showing {filteredHistory.length} of {borrowingHistory.length} records
                    </span>
                </div>
            </section>
        </div>
    );
}

export default BorrowingHistory;
