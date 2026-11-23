import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", email: "", enabled: true });
    const [showAddLibrarianModal, setShowAddLibrarianModal] = useState(false);
    const [librarianForm, setLibrarianForm] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await apiconnect.getData("/api/users");
            setUsers(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch users");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setEditForm({ name: user.name, email: user.email, enabled: user.enabled });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await apiconnect.putData(`/api/users/${editingUser.id}`, editForm);
            await fetchUsers();
            setEditingUser(null);
            setError(null);
        } catch (err) {
            setError("Failed to update user");
            console.error(err);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await apiconnect.deleteData(`/api/users/${userId}`);
                await fetchUsers();
                setError(null);
            } catch (err) {
                setError("Failed to delete user");
                console.error(err);
            }
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await apiconnect.putData(`/api/users/${user.id}`, {
                name: user.name,
                email: user.email,
                enabled: !user.enabled
            });
            await fetchUsers();
            setError(null);
        } catch (err) {
            setError("Failed to update user status");
            console.error(err);
        }
    };

    const handleAddLibrarian = async (e) => {
        e.preventDefault();
        try {
            await apiconnect.postData("/api/users/librarians", librarianForm);
            await fetchUsers();
            setShowAddLibrarianModal(false);
            setLibrarianForm({ name: "", email: "", password: "" });
            setError(null);
        } catch (err) {
            setError("Failed to add librarian");
            console.error(err);
        }
    };

    const librarians = users.filter((user) => user.role === "LIBRARIAN");
    const members = users.filter((user) => user.role === "MEMBER");

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    const getStatus = (enabled) => {
        return enabled ? "Active" : "Inactive";
    };

    const getStatusClass = (enabled) => {
        return enabled ? "active" : "inactive";
    };

    if (loading) {
        return <div className="admin-dashboard">Loading...</div>;
    }

    if (error) {
        return <div className="admin-dashboard">Error: {error}</div>;
    }

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
                <button className="admin-btn admin-btn-primary" onClick={() => setShowAddLibrarianModal(true)}>+ Add Librarian</button>
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
                                <th>Role</th>
                                <th>Joined Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {librarians.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                        No librarians found
                                    </td>
                                </tr>
                            ) : (
                                librarians.map((librarian) => (
                                    <tr key={librarian.id}>
                                        <td>#{librarian.id}</td>
                                        <td className="admin-book-title">{librarian.name}</td>
                                        <td>{librarian.email}</td>
                                        <td>{librarian.role}</td>
                                        <td>{formatDate(librarian.createdAt)}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${getStatusClass(librarian.enabled)}`}>
                                                {getStatus(librarian.enabled)}
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
                                                <button className="admin-btn-icon admin-btn-edit" title="Edit" onClick={() => handleEdit(librarian)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button className="admin-btn-icon admin-btn-delete" title="Delete" onClick={() => handleDelete(librarian.id)}>
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
                                <th>Role</th>
                                <th>Member Since</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                        No members found
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member.id}>
                                        <td>#{member.id}</td>
                                        <td className="admin-book-title">{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>{member.role}</td>
                                        <td>{formatDate(member.createdAt)}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge-${getStatusClass(member.enabled)}`}>
                                                {getStatus(member.enabled)}
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
                                                <button className="admin-btn-icon admin-btn-edit" title="Edit" onClick={() => handleEdit(member)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button className="admin-btn-icon admin-btn-delete" title="Delete" onClick={() => handleDelete(member.id)}>
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
                    <span className="admin-pagination-info">Showing {members.length} members</span>
                </div>
            </section>

            {editingUser && (
                <div className="admin-modal-overlay" onClick={() => setEditingUser(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Edit User</h2>
                            <button className="admin-modal-close" onClick={() => setEditingUser(null)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="admin-modal-form">
                            <div className="admin-form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editForm.enabled}
                                        onChange={(e) => setEditForm({ ...editForm, enabled: e.target.checked })}
                                    />
                                    {' '}Enabled
                                </label>
                            </div>
                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setEditingUser(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn-primary"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAddLibrarianModal && (
                <div className="admin-modal-overlay" onClick={() => setShowAddLibrarianModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Add New Librarian</h2>
                            <button className="admin-modal-close" onClick={() => setShowAddLibrarianModal(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleAddLibrarian} className="admin-modal-form">
                            <div className="admin-form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    value={librarianForm.name}
                                    onChange={(e) => setLibrarianForm({ ...librarianForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={librarianForm.email}
                                    onChange={(e) => setLibrarianForm({ ...librarianForm, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    value={librarianForm.password}
                                    onChange={(e) => setLibrarianForm({ ...librarianForm, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => {
                                        setShowAddLibrarianModal(false);
                                        setLibrarianForm({ name: "", email: "", password: "" });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn-primary"
                                >
                                    Add Librarian
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
