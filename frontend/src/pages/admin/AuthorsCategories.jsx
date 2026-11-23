import { useState, useEffect } from "react";
import apiconnect from "../../servises/ApiConnect";

function AuthorsCategories() {
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAuthorModal, setShowAuthorModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [viewingAuthor, setViewingAuthor] = useState(null);
    const [viewingCategory, setViewingCategory] = useState(null);
    const [authorFormData, setAuthorFormData] = useState({
        name: "",
        biography: "",
    });
    const [categoryFormData, setCategoryFormData] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        fetchAuthors();
        fetchCategories();
    }, []);

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const data = await apiconnect.getData("/api/authors");
            setAuthors(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch authors");
            console.error(err);
        } finally {
            setLoading(false);
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

    const handleDeleteAuthor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this author?")) return;

        try {
            await apiconnect.deleteData(`/api/authors/${id}`);
            setAuthors(authors.filter((author) => author.id !== id));
        } catch (err) {
            alert("Failed to delete author");
            console.error(err);
        }
    };

    const handleViewAuthor = (author) => {
        setViewingAuthor(author);
    };

    const handleEditAuthor = (author) => {
        setEditingAuthor(author);
        setAuthorFormData({
            name: author.name,
            biography: author.biography || "",
        });
        setShowAuthorModal(true);
    };

    const handleAddAuthor = () => {
        setEditingAuthor(null);
        setAuthorFormData({
            name: "",
            biography: "",
        });
        setShowAuthorModal(true);
    };

    const handleAuthorSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAuthor) {
                await apiconnect.putData(`/api/authors/${editingAuthor.id}`, authorFormData);
                setAuthors(authors.map((author) => (author.id === editingAuthor.id ? { ...author, ...authorFormData } : author)));
            } else {
                const newAuthor = await apiconnect.postData("/api/authors", authorFormData);
                setAuthors([...authors, newAuthor]);
            }
            setShowAuthorModal(false);
            setEditingAuthor(null);
        } catch (err) {
            alert("Failed to save author");
            console.error(err);
        }
    };

    const handleAuthorInputChange = (e) => {
        setAuthorFormData({ ...authorFormData, [e.target.name]: e.target.value });
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await apiconnect.deleteData(`/api/categories/${id}`);
            setCategories(categories.filter((category) => category.id !== id));
        } catch (err) {
            alert("Failed to delete category");
            console.error(err);
        }
    };

    const handleViewCategory = (category) => {
        setViewingCategory(category);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setCategoryFormData({
            name: category.name,
            description: category.description || "",
        });
        setShowCategoryModal(true);
    };

    const handleAddCategory = () => {
        setEditingCategory(null);
        setCategoryFormData({
            name: "",
            description: "",
        });
        setShowCategoryModal(true);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await apiconnect.putData(`/api/categories/${editingCategory.id}`, categoryFormData);
                setCategories(categories.map((category) => (category.id === editingCategory.id ? { ...category, ...categoryFormData } : category)));
            } else {
                const newCategory = await apiconnect.postData("/api/categories", categoryFormData);
                setCategories([...categories, newCategory]);
            }
            setShowCategoryModal(false);
            setEditingCategory(null);
        } catch (err) {
            alert("Failed to save category");
            console.error(err);
        }
    };

    const handleCategoryInputChange = (e) => {
        setCategoryFormData({ ...categoryFormData, [e.target.name]: e.target.value });
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
                <h1>Authors & Categories</h1>
                <p>Manage authors and book categories in the library</p>
            </div>

            <div className="admin-dashboard-panels">
                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <h2 className="admin-panel-title">Authors</h2>
                        <button className="admin-btn admin-btn-primary" onClick={handleAddAuthor}>
                            + Add Author
                        </button>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Biography</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {authors.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                            No authors found
                                        </td>
                                    </tr>
                                ) : (
                                    authors.map((author) => (
                                        <tr key={author.id}>
                                            <td>#{author.id}</td>
                                            <td className="admin-book-title">{author.name}</td>
                                            <td className="admin-category-desc">{author.biography || "-"}</td>
                                            <td>
                                                <div className="admin-action-buttons">
                                                    <button
                                                        className="admin-btn-icon admin-btn-view"
                                                        title="View"
                                                        onClick={() => handleViewAuthor(author)}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="admin-btn-icon admin-btn-edit"
                                                        title="Edit"
                                                        onClick={() => handleEditAuthor(author)}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="admin-btn-icon admin-btn-delete"
                                                        title="Delete"
                                                        onClick={() => handleDeleteAuthor(author.id)}
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
                </section>

                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <h2 className="admin-panel-title">Categories</h2>
                        <button className="admin-btn admin-btn-primary" onClick={handleAddCategory}>
                            + Add Category
                        </button>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                            No categories found
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>#{category.id}</td>
                                            <td className="admin-book-title">{category.name}</td>
                                            <td className="admin-category-desc">{category.description || "-"}</td>
                                            <td>
                                                <div className="admin-action-buttons">
                                                    <button
                                                        className="admin-btn-icon admin-btn-view"
                                                        title="View"
                                                        onClick={() => handleViewCategory(category)}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="admin-btn-icon admin-btn-edit"
                                                        title="Edit"
                                                        onClick={() => handleEditCategory(category)}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="admin-btn-icon admin-btn-delete"
                                                        title="Delete"
                                                        onClick={() => handleDeleteCategory(category.id)}
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
                </section>
            </div>

            {showAuthorModal && (
                <div className="admin-modal-overlay" onClick={() => setShowAuthorModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingAuthor ? "Edit Author" : "Add New Author"}</h2>
                            <button className="admin-modal-close" onClick={() => setShowAuthorModal(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleAuthorSubmit} className="admin-modal-form">
                            <div className="admin-form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={authorFormData.name}
                                    onChange={handleAuthorInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Biography</label>
                                <textarea
                                    name="biography"
                                    value={authorFormData.biography}
                                    onChange={handleAuthorInputChange}
                                    rows="4"
                                />
                            </div>
                            <div className="admin-modal-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAuthorModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {editingAuthor ? "Update Author" : "Add Author"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewingAuthor && (
                <div className="admin-modal-overlay" onClick={() => setViewingAuthor(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Author Details</h2>
                            <button className="admin-modal-close" onClick={() => setViewingAuthor(null)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">ID:</span>
                                <span className="admin-detail-value">#{viewingAuthor.id}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Name:</span>
                                <span className="admin-detail-value">{viewingAuthor.name}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Biography:</span>
                                <span className="admin-detail-value">{viewingAuthor.biography || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCategoryModal && (
                <div className="admin-modal-overlay" onClick={() => setShowCategoryModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
                            <button className="admin-modal-close" onClick={() => setShowCategoryModal(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="admin-modal-form">
                            <div className="admin-form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={categoryFormData.name}
                                    onChange={handleCategoryInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={categoryFormData.description}
                                    onChange={handleCategoryInputChange}
                                    rows="4"
                                />
                            </div>
                            <div className="admin-modal-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowCategoryModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {editingCategory ? "Update Category" : "Add Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewingCategory && (
                <div className="admin-modal-overlay" onClick={() => setViewingCategory(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Category Details</h2>
                            <button className="admin-modal-close" onClick={() => setViewingCategory(null)}>
                                ×
                            </button>
                        </div>
                        <div className="admin-modal-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">ID:</span>
                                <span className="admin-detail-value">#{viewingCategory.id}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Name:</span>
                                <span className="admin-detail-value">{viewingCategory.name}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Description:</span>
                                <span className="admin-detail-value">{viewingCategory.description || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AuthorsCategories;
