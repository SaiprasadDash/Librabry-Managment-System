const books = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Programming", quantity: 5, available: 3, addedDate: "2026-01-15" },
    { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "978-0201616224", category: "Programming", quantity: 4, available: 2, addedDate: "2026-02-20" },
    { id: 3, title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", category: "Computer Science", quantity: 3, available: 1, addedDate: "2026-03-10" },
    { id: 4, title: "Design Patterns", author: "Erich Gamma", isbn: "978-0201633610", category: "Software Engineering", quantity: 6, available: 4, addedDate: "2026-04-05" },
    { id: 5, title: "Effective Java", author: "Joshua Bloch", isbn: "978-0134685991", category: "Programming", quantity: 5, available: 0, addedDate: "2026-05-12" },
    { id: 6, title: "Head First Java", author: "Kathy Sierra", isbn: "978-0596009205", category: "Programming", quantity: 4, available: 2, addedDate: "2026-06-18" },
    { id: 7, title: "Refactoring", author: "Martin Fowler", isbn: "978-0201485677", category: "Software Engineering", quantity: 3, available: 3, addedDate: "2026-07-22" },
    { id: 8, title: "The C Programming Language", author: "Brian Kernighan", isbn: "978-0131103627", category: "Programming", quantity: 5, available: 5, addedDate: "2026-08-30" },
];

function BookManagement() {
    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h1>Book Management</h1>
                <p>Manage library books - add, edit, delete, search, and view</p>
            </div>

            <div className="admin-filters">
                <div className="admin-search-box">
                    <input type="text" placeholder="Search by title, author, or ISBN..." className="admin-search-input" />
                    <button className="admin-search-btn">Search</button>
                </div>
                <div className="admin-filter-options">
                    <select className="admin-filter-select">
                        <option value="">All Categories</option>
                        <option value="Programming">Programming</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Software Engineering">Software Engineering</option>
                    </select>
                    <select className="admin-filter-select">
                        <option value="">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>
                <button className="admin-btn admin-btn-primary">+ Add New Book</button>
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
                                <th>Quantity</th>
                                <th>Available</th>
                                <th>Added Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
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
                                    <td>{book.quantity}</td>
                                    <td>
                                        <span className={`admin-badge admin-badge-${book.available > 0 ? 'available' : 'unavailable'}`}>
                                            {book.available}
                                        </span>
                                    </td>
                                    <td>{book.addedDate}</td>
                                    <td>
                                        <div className="admin-action-buttons">
                                            <button className="admin-btn-icon admin-btn-view" title="View">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </button>
                                            <button className="admin-btn-icon admin-btn-edit" title="Edit">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button className="admin-btn-icon admin-btn-delete" title="Delete">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <span className="admin-pagination-info">Showing 1-8 of 8 books</span>
                    <div className="admin-pagination-controls">
                        <button className="admin-btn admin-btn-secondary" disabled>Previous</button>
                        <button className="admin-btn admin-btn-secondary admin-btn-active">1</button>
                        <button className="admin-btn admin-btn-secondary" disabled>Next</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BookManagement;
