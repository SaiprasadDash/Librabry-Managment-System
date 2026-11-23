import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function AllBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [viewingBook, setViewingBook] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await apiconnect.getData("/api/books");
            setBooks(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch books");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.authors?.some((author) => author.name?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = !categoryFilter || book.categories?.some((cat) => cat.name === categoryFilter);

        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(books.flatMap((book) => book.categories?.map((cat) => cat.name) || []))];

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
                <div className="admin-filter-options">
                    <select
                        className="admin-filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
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
                                <th>Title</th>
                                <th>Authors</th>
                                <th>ISBN</th>
                                <th>Categories</th>
                                <th>Total Copies</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
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
                                        <td>{book.totalCopies}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                                                {book.availableCopies}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-action-buttons">
                                                <button
                                                    className="admin-btn-icon admin-btn-view"
                                                    title="View Details"
                                                    onClick={() => setViewingBook(book)}
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
                        Showing {filteredBooks.length} of {books.length} books
                    </span>
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

export default AllBooks;
