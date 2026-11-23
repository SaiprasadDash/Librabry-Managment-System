import { useState, useEffect, useRef } from "react";
import apiconnect from "../../servises/ApiConnect";

function MultiSelect({ options, selectedIds, onChange, label, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const getSelectedNames = () => {
        return options
            .filter((option) => selectedIds.includes(option.id))
            .map((option) => option.name)
            .join(", ");
    };

    return (
        <div className="admin-form-group">
            <label>{label}</label>
            <div className="admin-multi-select-wrapper" ref={dropdownRef}>
                <div
                    className="admin-multi-select-trigger"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedIds.length > 0 ? getSelectedNames() : placeholder}
                    <span className="admin-multi-select-arrow">▼</span>
                </div>
                {isOpen && (
                    <div className="admin-multi-select-dropdown">
                        {options.length === 0 ? (
                            <div className="admin-multi-select-no-options">No options available</div>
                        ) : (
                            options.map((option) => (
                                <div
                                    key={option.id}
                                    className="admin-multi-select-option"
                                    onClick={() => toggleSelection(option.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(option.id)}
                                        onChange={() => {}}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span>{option.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function BookManagement() {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [viewingBook, setViewingBook] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const [bookToDelete, setBookToDelete] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        isbn: "",
        description: "",
        publisher: "",
        publishedYear: "",
        totalCopies: "",
        authorIds: [],
        categoryIds: [],
    });

    useEffect(() => {
        fetchBooks();
        fetchAuthors();
        fetchCategories();
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

    const fetchAuthors = async () => {
        try {
            const data = await apiconnect.getData("/api/authors");
            setAuthors(data);
        } catch (err) {
            console.error("Failed to fetch authors", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await apiconnect.getData("/api/categories");
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleView = (book) => {
        setViewingBook(book);
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            isbn: book.isbn,
            description: book.description || "",
            publisher: book.publisher || "",
            publishedYear: book.publishedYear || "",
            totalCopies: book.totalCopies || book.quantity,
            authorIds: book.authors?.map((author) => author.id) || [],
            categoryIds: book.categories?.map((category) => category.id) || [],
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingBook(null);
        setFormData({
            title: "",
            isbn: "",
            description: "",
            publisher: "",
            publishedYear: "",
            totalCopies: "",
            authorIds: [],
            categoryIds: [],
        });
        setShowModal(true);
    };

    const handleDeleteRequest = (book) => {
        setBookToDelete(book);
        setDeleteReason("");
        setShowDeleteModal(true);
    };

    const confirmDeleteRequest = async () => {
        if (!deleteReason.trim()) {
            alert("Please provide a reason for the deletion request");
            return;
        }
        try {
            await apiconnect.postData(`/api/books/${bookToDelete.id}/delete-request`, {
                reason: deleteReason
            });
            alert("Delete request sent to admin for approval");
            setShowDeleteModal(false);
            setBookToDelete(null);
            setDeleteReason("");
        } catch (err) {
            alert("Failed to send delete request");
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : null,
                totalCopies: parseInt(formData.totalCopies),
            };

            if (editingBook) {
                await apiconnect.putData(`/api/books/${editingBook.id}`, payload);
            } else {
                await apiconnect.postData("/api/books", payload);
            }

            await fetchBooks();
            setShowModal(false);
            setEditingBook(null);
        } catch (err) {
            alert("Failed to save book");
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.authors?.some((author) => author.name?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = !categoryFilter || book.categories?.some((cat) => cat.name === categoryFilter);

        return matchesSearch && matchesCategory;
    });

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
                        onChange={handleSearch}
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
                            <option key={category.id} value={category.name}>
                                {category.name}
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
                                                    title="Request Delete"
                                                    onClick={() => handleDeleteRequest(book)}
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
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Publisher</label>
                                <input
                                    type="text"
                                    name="publisher"
                                    value={formData.publisher}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Published Year</label>
                                <input
                                    type="number"
                                    name="publishedYear"
                                    value={formData.publishedYear}
                                    onChange={handleInputChange}
                                />
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
                            <MultiSelect
                                options={authors}
                                selectedIds={formData.authorIds}
                                onChange={(ids) => setFormData({ ...formData, authorIds: ids })}
                                label="Authors *"
                                placeholder="Select authors..."
                            />
                            <MultiSelect
                                options={categories}
                                selectedIds={formData.categoryIds}
                                onChange={(ids) => setFormData({ ...formData, categoryIds: ids })}
                                label="Categories *"
                                placeholder="Select categories..."
                            />
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

            {showDeleteModal && bookToDelete && (
                <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Request Book Deletion</h2>
                            <button className="admin-modal-close" onClick={() => setShowDeleteModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Book:</span>
                                <span className="admin-detail-value">{bookToDelete.title}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">ISBN:</span>
                                <span className="admin-detail-value">{bookToDelete.isbn}</span>
                            </div>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); confirmDeleteRequest(); }} className="admin-modal-form">
                            <div className="admin-form-group">
                                <label>Reason for Deletion *</label>
                                <textarea
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                    rows="4"
                                    placeholder="Please provide a reason for this deletion request..."
                                    required
                                />
                            </div>
                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn-primary"
                                >
                                    Send Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookManagement;
