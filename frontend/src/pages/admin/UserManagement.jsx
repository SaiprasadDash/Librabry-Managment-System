const librarians = [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@library.com", phone: "+91 98765 43210", joinedDate: "2026-01-10", status: "Active" },
    { id: 2, name: "Sunita Verma", email: "sunita@library.com", phone: "+91 98765 43211", joinedDate: "2026-03-15", status: "Active" },
    { id: 3, name: "Anil Sharma", email: "anil@library.com", phone: "+91 98765 43212", joinedDate: "2026-05-20", status: "Inactive" },
];

const members = [
    { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91 98765 12345", memberSince: "2026-02-01", booksBorrowed: 3, status: "Active" },
    { id: 2, name: "Priya Patel", email: "priya@gmail.com", phone: "+91 98765 12346", memberSince: "2026-03-10", booksBorrowed: 2, status: "Active" },
    { id: 3, name: "Amit Kumar", email: "amit@gmail.com", phone: "+91 98765 12347", memberSince: "2026-04-15", booksBorrowed: 1, status: "Suspended" },
    { id: 4, name: "Sneha Das", email: "sneha@gmail.com", phone: "+91 98765 12348", memberSince: "2026-05-20", booksBorrowed: 0, status: "Active" },
    { id: 5, name: "Vikram Singh", email: "vikram@gmail.com", phone: "+91 98765 12349", memberSince: "2026-06-25", booksBorrowed: 2, status: "Active" },
];

function UserManagement() {
    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h1>Librarians & Members</h1>
                <p>Manage library staff and member accounts</p>
            </div>

            <div className="admin-filters">
                <div className="admin-search-box">
                    <input type="text" placeholder="Search by name, email, or phone..." className="admin-search-input" />
                    <button className="admin-search-btn">Search</button>
                </div>
                <div className="admin-filter-options">
                    <select className="admin-filter-select">
                        <option value="">All Roles</option>
                        <option value="librarian">Librarians</option>
                        <option value="member">Members</option>
                    </select>
                    <select className="admin-filter-select">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
                <button className="admin-btn admin-btn-primary">+ Add User</button>
            </div>

            <section className="admin-panel">
                <h2 className="admin-panel-title">Librarians</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Joined Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {librarians.map((librarian) => (
                                <tr key={librarian.id}>
                                    <td>#{librarian.id}</td>
                                    <td className="admin-book-title">{librarian.name}</td>
                                    <td>{librarian.email}</td>
                                    <td>{librarian.phone}</td>
                                    <td>{librarian.joinedDate}</td>
                                    <td>
                                        <span className={`admin-badge admin-badge-${librarian.status.toLowerCase()}`}>
                                            {librarian.status}
                                        </span>
                                    </td>
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
                <h2 className="admin-panel-title">Members</h2>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Member Since</th>
                                <th>Books Borrowed</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td>#{member.id}</td>
                                    <td className="admin-book-title">{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.phone}</td>
                                    <td>{member.memberSince}</td>
                                    <td>{member.booksBorrowed}</td>
                                    <td>
                                        <span className={`admin-badge admin-badge-${member.status.toLowerCase()}`}>
                                            {member.status}
                                        </span>
                                    </td>
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
                    <span className="admin-pagination-info">Showing 1-5 of 5 members</span>
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

export default UserManagement;
