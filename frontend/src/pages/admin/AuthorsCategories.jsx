const authors = [
    { id: 1, name: "Robert C. Martin", books: 5, addedDate: "2026-01-15" },
    { id: 2, name: "Andrew Hunt", books: 3, addedDate: "2026-02-20" },
    { id: 3, name: "Thomas H. Cormen", books: 2, addedDate: "2026-03-10" },
    { id: 4, name: "Erich Gamma", books: 4, addedDate: "2026-04-05" },
    { id: 5, name: "Joshua Bloch", books: 3, addedDate: "2026-05-12" },
];

const categories = [
    { id: 1, name: "Programming", books: 45, description: "Programming languages and software development" },
    { id: 2, name: "Computer Science", books: 32, description: "Algorithms, data structures, and theory" },
    { id: 3, name: "Software Engineering", books: 28, description: "Software design, patterns, and methodologies" },
    { id: 4, name: "Database", books: 18, description: "Database systems and management" },
    { id: 5, name: "Web Development", books: 22, description: "Frontend and backend web technologies" },
];

function AuthorsCategories() {
    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h1>Authors & Categories</h1>
                <p>Manage authors and book categories in the library</p>
            </div>

            <div className="admin-dashboard-panels">
                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <h2 className="admin-panel-title">Authors</h2>
                        <button className="admin-btn admin-btn-primary">+ Add Author</button>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Books</th>
                                    <th>Added Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {authors.map((author) => (
                                    <tr key={author.id}>
                                        <td>#{author.id}</td>
                                        <td className="admin-book-title">{author.name}</td>
                                        <td>{author.books}</td>
                                        <td>{author.addedDate}</td>
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
                </section>

                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <h2 className="admin-panel-title">Categories</h2>
                        <button className="admin-btn admin-btn-primary">+ Add Category</button>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Books</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>#{category.id}</td>
                                        <td className="admin-book-title">{category.name}</td>
                                        <td>{category.books}</td>
                                        <td className="admin-category-desc">{category.description}</td>
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
                </section>
            </div>
        </div>
    );
}

export default AuthorsCategories;
