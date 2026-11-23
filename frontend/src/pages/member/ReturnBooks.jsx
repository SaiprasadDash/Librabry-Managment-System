import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function ReturnBooks() {
    const [myBorrowings, setMyBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyBorrowings();
    }, []);

    const fetchMyBorrowings = async () => {
        try {
            setLoading(true);
            const data = await apiconnect.getData("/api/borrowings/all");
            setMyBorrowings(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch borrowings");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReturnRequest = async (borrowingId) => {
        if (!window.confirm("Are you sure you want to request return of this book?")) {
            return;
        }
        try {
            await apiconnect.putData(`/api/borrowings/${borrowingId}/return`, {});
            alert("Return request sent successfully!");
            await fetchMyBorrowings();
        } catch (err) {
            alert("Failed to send return request");
            console.error(err);
        }
    };

    const myBorrowedBooks = myBorrowings.filter(b => b.status === "BORROWED");

    if (loading) {
        return <div className="admin-dashboard">Loading...</div>;
    }

    if (error) {
        return <div className="admin-dashboard">Error: {error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <section className="admin-panel">
                <h2 className="admin-panel-title">My Borrowed Books</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>ISBN</th>
                                <th>Borrowed Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Fine</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myBorrowedBooks.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                        No borrowed books to return
                                    </td>
                                </tr>
                            ) : (
                                myBorrowedBooks.map((borrowing) => (
                                    <tr key={borrowing.id}>
                                        <td>{borrowing.bookTitle}</td>
                                        <td className="admin-isbn">{borrowing.isbn}</td>
                                        <td>{borrowing.borrowDate}</td>
                                        <td>{borrowing.dueDate}</td>
                                        <td>
                                            <span className="admin-badge admin-badge-available">
                                                {borrowing.status}
                                            </span>
                                        </td>
                                        <td className={borrowing.fineAmount > 0 ? "admin-fine-amount" : "admin-fine-zero"}>
                                            Rs. {borrowing.fineAmount}
                                        </td>
                                        <td>
                                            <button
                                                className="admin-btn admin-btn-return"
                                                onClick={() => handleReturnRequest(borrowing.id)}
                                            >
                                                Return
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span className="admin-pagination-info">
                        Showing {myBorrowedBooks.length} borrowed books
                    </span>
                </div>
            </section>
        </div>
    );
}

export default ReturnBooks;
