import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function BorrowBooks() {
    const [books, setBooks] = useState([]);
    const [myBorrowings, setMyBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingBook, setViewingBook] = useState(null);

    useEffect(() => {
        fetchBooks();
        fetchMyBorrowings();
    }, []);

    const fetchBooks = async () => {
        try {
            const data = await apiconnect.getData("/api/books");
            setBooks(data);
        } catch (err) {
            console.error("Failed to fetch books", err);
        }
    };

    const fetchMyBorrowings = async () => {
        try {
            setLoading(true);
            const data = await apiconnect.getData("/api/borrowings/my");
            setMyBorrowings(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch borrowings");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBorrowRequest = async (bookId) => {
        try {
            await apiconnect.postData(`/api/borrowings/${bookId}`, {});
            alert("Borrow request sent successfully! Wait for librarian approval.");
            await fetchMyBorrowings();
        } catch (err) {
            alert("Failed to send borrow request");
            console.error(err);
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

    const filteredBooks = books.filter((book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors?.some((author) => author.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const hasBorrowedBook = (bookId) => {
        return myBorrowings.some(b => b.bookId === bookId && b.status === "BORROWED");
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
                        placeholder="Search by title, author, or ISBN..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="admin-search-btn">Search</button>
                </div>
            </div>

            <section className="admin-panel">
                <h2 className="admin-panel-title">Available Books</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Authors</th>
                                <th>ISBN</th>
                                <th>Categories</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                        No books found
                                    </td>
                                </tr>
                            ) : (
                                filteredBooks.map((book) => (
                                    <tr key={book.id}>
                                        <td>#{book.id}</td>
                                        <td>
                                            <span className="admin-book-title">{book.title}</span>
                                        </td>
                                        <td>
                                            {book.authors?.map((author) => author.name).join(", ") || "-"}
                                        </td>
                                        <td className="admin-isbn">{book.isbn}</td>
                                        <td>
                                            {book.categories?.map((cat) => (
                                                <span key={cat.id} className="admin-badge admin-badge-category" style={{ marginRight: "4px" }}>
                                                    {cat.name}
                                                </span>
                                            )) || "-"}
                                        </td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                                                {book.availableCopies}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-action-buttons">
                                                {book.availableCopies > 0 && !hasBorrowedBook(book.id) ? (
                                                    <button
                                                        className="admin-btn admin-btn-primary"
                                                        onClick={() => handleBorrowRequest(book.id)}
                                                    >
                                                        Borrow
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: "13px", color: "var(--text)" }}>
                                                        {hasBorrowedBook(book.id) ? "Already Borrowed" : "Not Available"}
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
                        Showing {filteredBooks.length} of {books.length} books
                    </span>
                </div>
            </section>

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
                            {myBorrowings.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                        No borrowed books
                                    </td>
                                </tr>
                            ) : (
                                myBorrowings.map((borrowing) => (
                                    <tr key={borrowing.id}>
                                        <td>{borrowing.bookTitle}</td>
                                        <td className="admin-isbn">{borrowing.isbn}</td>
                                        <td>{borrowing.borrowDate || "-"}</td>
                                        <td>{borrowing.dueDate || "-"}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${borrowing.status === "BORROWED" ? "available" : "unavailable"}`}>
                                                {borrowing.status}
                                            </span>
                                        </td>
                                        <td className={borrowing.fineAmount > 0 ? "admin-fine-amount" : "admin-fine-zero"}>
                                            Rs. {borrowing.fineAmount}
                                        </td>
                                        <td>
                                            {borrowing.status === "BORROWED" && (
                                                <button
                                                    className="admin-btn admin-btn-return"
                                                    onClick={() => handleReturnRequest(borrowing.id)}
                                                >
                                                    Return
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {viewingBook && (
                <div className="admin-modal-overlay" onClick={() => setViewingBook(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Book Details</h2>
                            <button className="admin-modal-close" onClick={() => setViewingBook(null)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-form">
                            <div className="admin-form-group">
                                <label>Title:</label>
                                <p>{viewingBook.title}</p>
                            </div>
                            <div className="admin-form-group">
                                <label>ISBN:</label>
                                <p>{viewingBook.isbn}</p>
                            </div>
                            <div className="admin-form-group">
                                <label>Description:</label>
                                <p>{viewingBook.description || "-"}</p>
                            </div>
                            <div className="admin-form-group">
                                <label>Publisher:</label>
                                <p>{viewingBook.publisher || "-"}</p>
                            </div>
                            <div className="admin-form-group">
                                <label>Published Year:</label>
                                <p>{viewingBook.publishedYear || "-"}</p>
                            </div>
                            <div className="admin-form-group">
                                <label>Authors:</label>
                                <p>{viewingBook.authors?.map((a) => a.name).join(", ") || "-"}</p>
                            </div>
                            <div className="admin-form-group">
                                <label>Categories:</label>
                                <p>{viewingBook.categories?.map((c) => c.name).join(", ") || "-"}</p>
                            </div>
                            <div className="admin-form-group">
                                <label>Total Copies:</label>
                                <p>{viewingBook.totalCopies}</p>
                            </div>
                            <div className="admin-form-group">
                                <label>Available Copies:</label>
                                <p>{viewingBook.availableCopies}</p>
                            </div>
                            <div className="admin-modal-footer">
                                <button
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setViewingBook(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BorrowBooks;
