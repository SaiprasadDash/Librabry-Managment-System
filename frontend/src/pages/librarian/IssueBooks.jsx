import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function IssueBooks() {
    const [borrowRequests, setBorrowRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBorrowRequests();
    }, []);

    const fetchBorrowRequests = async () => {
        try {
            setLoading(true);
            const data = await apiconnect.getData("/api/borrowings/borrow-requests");
            setBorrowRequests(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch borrow requests");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveIssue = async (requestId) => {
        if (!window.confirm("Are you sure you want to approve and issue this book?")) {
            return;
        }
        try {
            await apiconnect.putData(`/api/borrowings/${requestId}/issue`, {});
            alert("Book issued successfully!");
            await fetchBorrowRequests();
        } catch (err) {
            alert("Failed to issue book");
            console.error(err);
        }
    };

    const filteredRequests = borrowRequests.filter((request) =>
        request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusClass = (status) => {
        switch (status) {
            case "BORROW_PENDING": return "borrowed";
            case "BORROWED": return "available";
            case "RETURNED": return "active";
            case "OVERDUE": return "overdue";
            default: return "inactive";
        }
    };

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
                        placeholder="Search by member name, email, or book title..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="admin-search-btn">Search</button>
                </div>
            </div>

            <section className="admin-panel">
                <h2 className="admin-panel-title">Pending Borrow Requests</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Member</th>
                                <th>Email</th>
                                <th>Book</th>
                                <th>ISBN</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                        No pending borrow requests
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>#{request.id}</td>
                                        <td className="admin-book-title">{request.userName}</td>
                                        <td>{request.userEmail}</td>
                                        <td>{request.bookTitle}</td>
                                        <td className="admin-isbn">{request.isbn}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${getStatusClass(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-action-buttons">
                                                <button
                                                    className="admin-btn admin-btn-return"
                                                    onClick={() => handleApproveIssue(request.id)}
                                                >
                                                    Approve & Issue
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
                        Showing {filteredRequests.length} of {borrowRequests.length} requests
                    </span>
                </div>
            </section>
        </div>
    );
}

export default IssueBooks;
