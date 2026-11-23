import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function BookReservations() {
    const [books, setBooks] = useState([]);
    const [myReservations, setMyReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingBook, setViewingBook] = useState(null);

    useEffect(() => {
        fetchBooks();
        fetchMyReservations();
    }, []);

    const fetchBooks = async () => {
        try {
            const data = await apiconnect.getData("/api/books");
            setBooks(data);
        } catch (err) {
            console.error("Failed to fetch books", err);
        }
    };

    const getBookISBN = (bookId) => {
        const book = books.find(b => b.id === bookId);
        return book ? book.isbn : "-";
    };

    const fetchMyReservations = async () => {
        try {
            setLoading(true);
            const data = await apiconnect.getData("/api/reservations/my");
            setMyReservations(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch reservations");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReservationRequest = async (bookId) => {
        try {
            await apiconnect.postData(`/api/reservations/${bookId}`, {});
            alert("Reservation request sent successfully! Wait for librarian approval.");
            await fetchMyReservations();
        } catch (err) {
            alert("Failed to send reservation request");
            console.error(err);
        }
    };

    const handleCancelReservation = async (reservationId) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) {
            return;
        }
        try {
            await apiconnect.putData(`/api/reservations/${reservationId}/cancel`, {});
            alert("Reservation cancelled successfully!");
            await fetchMyReservations();
        } catch (err) {
            alert("Failed to cancel reservation");
            console.error(err);
        }
    };

    const filteredBooks = books.filter((book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors?.some((author) => author.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const hasReservedBook = (bookId) => {
        return myReservations.some(r => r.bookId === bookId && r.status === "WAITING");
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
                                                {book.availableCopies === 0 && !hasReservedBook(book.id) ? (
                                                    <button
                                                        className="admin-btn admin-btn-primary"
                                                        onClick={() => handleReservationRequest(book.id)}
                                                    >
                                                        Reserve
                                                    </button>
                                                ) : hasReservedBook(book.id) ? (
                                                    <span style={{ fontSize: "13px", color: "var(--text)" }}>
                                                        Reserved
                                                    </span>
                                                ) : book.availableCopies > 0 ? (
                                                    <span style={{ fontSize: "13px", color: "var(--text)" }}>
                                                        Available - Use Borrow
                                                    </span>
                                                ) : null}
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
                <h2 className="admin-panel-title">My Reservations</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>ISBN</th>
                                <th>Reservation Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myReservations.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                                        No reservations
                                    </td>
                                </tr>
                            ) : (
                                myReservations.map((reservation) => (
                                    <tr key={reservation.id}>
                                        <td>{reservation.bookTitle}</td>
                                        <td className="admin-isbn">{getBookISBN(reservation.bookId)}</td>
                                        <td>{new Date(reservation.reservationDate).toLocaleString()}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${reservation.status === "WAITING" ? "borrowed" : "available"}`}>
                                                {reservation.status}
                                            </span>
                                        </td>
                                        <td>
                                            {reservation.status === "WAITING" && (
                                                <button
                                                    className="admin-btn admin-btn-delete"
                                                    onClick={() => handleCancelReservation(reservation.id)}
                                                >
                                                    Cancel
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

export default BookReservations;
