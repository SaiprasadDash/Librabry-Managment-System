import { useState } from "react";

function OverdueBooks() {
    const [searchTerm, setSearchTerm] = useState("");

    const overdueBooks = [
        {
            id: 1,
            book: { id: 2, title: "To Kill a Mockingbird", isbn: "978-0061120084" },
            member: { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "555-0102" },
            borrowedDate: "2024-01-05",
            dueDate: "2024-01-19",
            overdueDays: 5,
            fine: 25,
        },
        {
            id: 2,
            book: { id: 5, title: "The Catcher in the Rye", isbn: "978-0316769488" },
            member: { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "555-0101" },
            borrowedDate: "2023-12-20",
            dueDate: "2024-01-03",
            overdueDays: 21,
            fine: 105,
        },
        {
            id: 3,
            book: { id: 3, title: "1984", isbn: "978-0451524935" },
            member: { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", phone: "555-0103" },
            borrowedDate: "2023-12-25",
            dueDate: "2024-01-08",
            overdueDays: 16,
            fine: 80,
        },
        {
            id: 4,
            book: { id: 1, title: "The Great Gatsby", isbn: "978-0743273565" },
            member: { id: 4, name: "Alice Brown", email: "alice.brown@example.com", phone: "555-0104" },
            borrowedDate: "2024-01-02",
            dueDate: "2024-01-16",
            overdueDays: 8,
            fine: 40,
        },
    ];

    const filteredOverdue = overdueBooks.filter((record) =>
        record.book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleContact = (member) => {
        const subject = encodeURIComponent(`Overdue Book Reminder - ${member.name}`);
        const body = encodeURIComponent(`Dear ${member.name},\n\nThis is a reminder that you have an overdue book. Please return it as soon as possible to avoid additional fines.\n\nThank you,\nLibrary Management`);
        window.open(`mailto:${member.email}?subject=${subject}&body=${body}`);
    };

    const handleReminder = (record) => {
        alert(`Reminder sent to ${record.member.name} for book: ${record.book.title}`);
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-filters">
                <div className="admin-search-box">
                    <input
                        type="text"
                        placeholder="Search by book title, member name, or email..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="admin-search-btn">Search</button>
                </div>
            </div>

            <section className="admin-panel">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Book Title</th>
                                <th>ISBN</th>
                                <th>Member Name</th>
                                <th>Member Email</th>
                                <th>Phone</th>
                                <th>Borrowed Date</th>
                                <th>Due Date</th>
                                <th>Overdue Days</th>
                                <th>Fine</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOverdue.length === 0 ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                                        No overdue books found
                                    </td>
                                </tr>
                            ) : (
                                filteredOverdue.map((record) => (
                                    <tr key={record.id}>
                                        <td>#{record.id}</td>
                                        <td className="admin-book-title">{record.book.title}</td>
                                        <td className="admin-isbn">{record.book.isbn}</td>
                                        <td>{record.member.name}</td>
                                        <td>{record.member.email}</td>
                                        <td>{record.member.phone}</td>
                                        <td>{record.borrowedDate}</td>
                                        <td className="admin-due-date">{record.dueDate}</td>
                                        <td className="admin-fine-amount">{record.overdueDays} days</td>
                                        <td className="admin-fine-amount">Rs. {record.fine}</td>
                                        <td>
                                            <div className="admin-action-buttons">
                                                <button
                                                    className="admin-btn-icon admin-btn-notify"
                                                    title="Send Reminder"
                                                    onClick={() => handleReminder(record)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="admin-btn-icon admin-btn-view"
                                                    title="Contact Member"
                                                    onClick={() => handleContact(record.member)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                        <polyline points="22,6 12,13 2,6"></polyline>
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
                        Showing {filteredOverdue.length} of {overdueBooks.length} overdue books
                    </span>
                </div>
            </section>
        </div>
    );
}

export default OverdueBooks;
