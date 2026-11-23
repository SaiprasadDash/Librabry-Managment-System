import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function BookDeleteRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("pending"); // pending, all
    const [viewingRequest, setViewingRequest] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const endpoint = filter === "all" 
                ? "/api/admin/book-delete-requests/all" 
                : "/api/admin/book-delete-requests";
            const data = await apiconnect.getData(endpoint);
            setRequests(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch deletion requests");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        if (!window.confirm("Are you sure you want to approve this deletion request? This will permanently delete the book.")) {
            return;
        }
        try {
            await apiconnect.patchData(`/api/admin/book-delete-requests/${requestId}`, {
                status: "APPROVED"
            });
            alert("Deletion request approved successfully");
            await fetchRequests();
        } catch (err) {
            alert("Failed to approve request");
            console.error(err);
        }
    };

    const handleReject = async (requestId) => {
        if (!window.confirm("Are you sure you want to reject this deletion request?")) {
            return;
        }
        try {
            await apiconnect.patchData(`/api/admin/book-delete-requests/${requestId}`, {
                status: "REJECTED"
            });
            alert("Deletion request rejected successfully");
            await fetchRequests();
        } catch (err) {
            alert("Failed to reject request");
            console.error(err);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED": return "paid";
            case "REJECTED": return "unavailable";
            case "PENDING": return "borrowed";
            default: return "inactive";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString();
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
                <div className="admin-filter-options">
                    <select
                        className="admin-filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="pending">Pending Requests</option>
                        <option value="all">All Requests</option>
                    </select>
                </div>
            </div>

            <section className="admin-panel">
                <h2 className="admin-panel-title">
                    {filter === "all" ? "All Book Deletion Requests" : "Pending Deletion Requests"}
                </h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Book Title</th>
                                <th>ISBN</th>
                                <th>Librarian</th>
                                <th>Librarian Email</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Requested At</th>
                                <th>Reviewed By</th>
                                <th>Reviewed At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                                        No deletion requests found
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request.id}>
                                        <td>#{request.id}</td>
                                        <td className="admin-book-title">{request.bookTitle}</td>
                                        <td className="admin-isbn">{request.isbn}</td>
                                        <td>{request.librarianName}</td>
                                        <td>{request.librarianEmail}</td>
                                        <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {request.reason}
                                        </td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${getStatusClass(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(request.requestedAt)}</td>
                                        <td>{request.reviewedBy || "-"}</td>
                                        <td>{formatDate(request.reviewedAt)}</td>
                                        <td>
                                            <div className="admin-action-buttons">
                                                {request.status === "PENDING" ? (
                                                    <>
                                                        <button
                                                            className="admin-btn admin-btn-pay"
                                                            onClick={() => handleApprove(request.id)}
                                                            style={{ padding: "6px 12px", fontSize: "12px" }}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="admin-btn admin-btn-delete"
                                                            onClick={() => handleReject(request.id)}
                                                            style={{ padding: "6px 12px", fontSize: "12px" }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span style={{ fontSize: "12px", color: "var(--text)" }}>
                                                        {request.status}
                                                    </span>
                                                )}
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
                        Showing {requests.length} requests
                    </span>
                </div>
            </section>

            {viewingRequest && (
                <div className="admin-modal-overlay" onClick={() => setViewingRequest(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Request Details</h2>
                            <button className="admin-modal-close" onClick={() => setViewingRequest(null)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Book Title:</span>
                                <span className="admin-detail-value">{viewingRequest.bookTitle}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">ISBN:</span>
                                <span className="admin-detail-value">{viewingRequest.isbn}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Librarian:</span>
                                <span className="admin-detail-value">{viewingRequest.librarianName}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Librarian Email:</span>
                                <span className="admin-detail-value">{viewingRequest.librarianEmail}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Reason:</span>
                                <span className="admin-detail-value" style={{ textAlign: "left", maxWidth: "70%" }}>
                                    {viewingRequest.reason}
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Status:</span>
                                <span className={`admin-badge admin-badge-${getStatusClass(viewingRequest.status)}`}>
                                    {viewingRequest.status}
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Requested At:</span>
                                <span className="admin-detail-value">{formatDate(viewingRequest.requestedAt)}</span>
                            </div>
                            {viewingRequest.reviewedBy && (
                                <>
                                    <div className="admin-detail-row">
                                        <span className="admin-detail-label">Reviewed By:</span>
                                        <span className="admin-detail-value">{viewingRequest.reviewedBy}</span>
                                    </div>
                                    <div className="admin-detail-row">
                                        <span className="admin-detail-label">Reviewed At:</span>
                                        <span className="admin-detail-value">{formatDate(viewingRequest.reviewedAt)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            <button
                                className="admin-btn admin-btn-secondary"
                                onClick={() => setViewingRequest(null)}
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

export default BookDeleteRequests;
