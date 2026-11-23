import { useState } from "react";

function BookManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [viewingBook, setViewingBook] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        isbn: "",
        author: "",
        category: "",
        totalCopies: "",
    });

    const books = [
        { id: 1, title: "The Great Gatsby", isbn: "978-0743273565", author: "F. Scott Fitzgerald", category: "Fiction", totalCopies: 5, availableCopies: 3 },
        { id: 2, title: "To Kill a Mockingbird", isbn: "978-0061120084", author: "Harper Lee", category: "Fiction", totalCopies: 8, availableCopies: 2 },
        { id: 3, title: "1984", isbn: "978-0451524935", author: "George Orwell", category: "Science Fiction", totalCopies: 4, availableCopies: 0 },
        { id: 4, title: "Pride and Prejudice", isbn: "978-0141439518", author: "Jane Austen", category: "Romance", totalCopies: 6, availableCopies: 4 },
        { id: 5, title: "The Catcher in the Rye", isbn: "978-0316769488", author: "J.D. Salinger", category: "Fiction", totalCopies: 3, availableCopies: 1 },
    ];

    const categories = ["Fiction", "Science Fiction", "Romance", "Mystery", "Biography", "History"];

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = !categoryFilter || book.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const handleView = (book) => {
        setViewingBook(book);
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            isbn: book.isbn,
            author: book.author,
            category: book.category,
            totalCopies: book.totalCopies,
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingBook(null);
        setFormData({
            title: "",
            isbn: "",
            author: "",
            category: "",
            totalCopies: "",
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            console.log("Delete book:", id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit:", editingBook ? "Edit" : "Add", formData);
        setShowModal(false);
        setEditingBook(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                <button className="admin-btn admin-btn-primary" onClick={handleAdd}>
                    + Add New Book
                </button>
            </div>

            <section className="admin-panel">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>ISBN</th>
                                <th>Category</th>
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
                                        <td>{book.author}</td>
                                        <td className="admin-isbn">{book.isbn}</td>
                                        <td>
                                            <span className="admin-badge admin-badge-category">{book.category}</span>
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
                                                    title="View"
                                                    onClick={() => handleView(book)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="admin-btn-icon admin-btn-edit"
                                                    title="Edit"
                                                    onClick={() => handleEdit(book)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="admin-btn-icon admin-btn-delete"
                                                    title="Delete"
                                                    onClick={() => handleDelete(book.id)}
                                                    disabled={book.availableCopies < book.totalCopies}
                                                    style={{ opacity: book.availableCopies < book.totalCopies ? 0.5 : 1 }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingBook ? "Edit Book" : "Add New Book"}</h2>
                            <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-modal-form">
                            <div className="admin-form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>ISBN *</label>
                                <input
                                    type="text"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Author *</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label>Total Copies *</label>
                                <input
                                    type="number"
                                    name="totalCopies"
                                    value={formData.totalCopies}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn-primary"
                                >
                                    {editingBook ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                <label>Author:</label>
                                <p>{viewingBook.author}</p>
                            </div>
                            <div className="admin-form-group">
                                <label>Category:</label>
                                <p>{viewingBook.category}</p>
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

export default BookManagement;
