import { useState } from "react";

function BorrowingHistory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const borrowingHistory = [
        {
            id: 1,
            member: "John Doe",
            book: "The Great Gatsby",
            borrowedDate: "2024-01-10",
            dueDate: "2024-01-24",
            returnDate: "2024-01-20",
            status: "Returned",
            fine: 0,
        },
        {
            id: 2,
            member: "Jane Smith",
            book: "To Kill a Mockingbird",
            borrowedDate: "2024-01-05",
            dueDate: "2024-01-19",
            returnDate: null,
            status: "Overdue",
            fine: 50,
        },
        {
            id: 3,
            member: "Alice Brown",
            book: "Pride and Prejudice",
            borrowedDate: "2024-01-15",
            dueDate: "2024-01-29",
            returnDate: null,
            status: "Active",
            fine: 0,
        },
        {
            id: 4,
            member: "John Doe",
            book: "The Catcher in the Rye",
            borrowedDate: "2023-12-20",
            dueDate: "2024-01-03",
            returnDate: "2024-01-10",
            status: "Returned Late",
            fine: 35,
        },
        {
            id: 5,
            member: "Bob Johnson",
            book: "1984",
            borrowedDate: "2024-01-01",
            dueDate: "2024-01-15",
            returnDate: "2024-01-14",
            status: "Returned",
            fine: 0,
        },
        {
            id: 6,
            member: "Jane Smith",
            book: "Brave New World",
            borrowedDate: "2023-12-10",
            dueDate: "2023-12-24",
            returnDate: "2023-12-28",
            status: "Returned Late",
            fine: 20,
        },
    ];

    const filteredHistory = borrowingHistory.filter((record) => {
        const matchesSearch =
            record.member?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.book?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = !dateFilter ||
            record.borrowedDate === dateFilter ||
            record.returnDate === dateFilter;

        const matchesStatus = !statusFilter || record.status === statusFilter;

        return matchesSearch && matchesDate && matchesStatus;
    });

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "active": return "available";
            case "returned": return "active";
            case "overdue": return "overdue";
            case "returned late": return "borrowed";
            default: return "inactive";
        }
    };

    const uniqueDates = [...new Set(borrowingHistory.flatMap(r => [r.borrowedDate, r.returnDate].filter(Boolean)))].sort();
    const uniqueStatuses = [...new Set(borrowingHistory.map(r => r.status))];

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
                                <th>Book</th>
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
                                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                filteredHistory.map((record) => (
                                    <tr key={record.id}>
                                        <td>#{record.id}</td>
                                        <td className="admin-book-title">{record.member}</td>
                                        <td>{record.book}</td>
                                        <td>{record.borrowedDate}</td>
                                        <td className={record.status === "Overdue" ? "admin-due-date" : ""}>{record.dueDate}</td>
                                        <td>{record.returnDate || "-"}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${getStatusClass(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className={record.fine > 0 ? "admin-fine-amount" : "admin-fine-zero"}>
                                            Rs. {record.fine}
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
