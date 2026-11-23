import { useState } from "react";

function IssueBooks() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [borrowingDate, setBorrowingDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState("");
    const [memberSearch, setMemberSearch] = useState("");
    const [bookSearch, setBookSearch] = useState("");
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);
    const [showBookDropdown, setShowBookDropdown] = useState(false);

    const members = [
        { id: 1, name: "John Doe", email: "john.doe@example.com", status: "Active", borrowedCount: 2, maxBorrow: 5, fines: 0 },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", status: "Active", borrowedCount: 1, maxBorrow: 5, fines: 50 },
        { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", status: "Suspended", borrowedCount: 0, maxBorrow: 5, fines: 150 },
        { id: 4, name: "Alice Brown", email: "alice.brown@example.com", status: "Active", borrowedCount: 4, maxBorrow: 5, fines: 0 },
    ];

    const books = [
        { id: 1, title: "The Great Gatsby", isbn: "978-0743273565", author: "F. Scott Fitzgerald", availableCopies: 3, totalCopies: 5 },
        { id: 2, title: "To Kill a Mockingbird", isbn: "978-0061120084", author: "Harper Lee", availableCopies: 2, totalCopies: 8 },
        { id: 3, title: "1984", isbn: "978-0451524935", author: "George Orwell", availableCopies: 0, totalCopies: 4 },
        { id: 4, title: "Pride and Prejudice", isbn: "978-0141439518", author: "Jane Austen", availableCopies: 4, totalCopies: 6 },
        { id: 5, title: "The Catcher in the Rye", isbn: "978-0316769488", author: "J.D. Salinger", availableCopies: 1, totalCopies: 3 },
    ];

    const filteredMembers = members.filter((member) =>
        member.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.email?.toLowerCase().includes(memberSearch.toLowerCase())
    );

    const filteredBooks = books.filter((book) =>
        book.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
        book.author?.toLowerCase().includes(bookSearch.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(bookSearch.toLowerCase())
    );

    const getMemberEligibility = (member) => {
        if (member.status !== "Active") return { eligible: false, reason: "Account is not active" };
        if (member.fines > 0) return { eligible: false, reason: "Has pending fines" };
        if (member.borrowedCount >= member.maxBorrow) return { eligible: false, reason: "Maximum borrow limit reached" };
        return { eligible: true, reason: "Eligible to borrow" };
    };

    const calculateDueDate = (borrowDate) => {
        const date = new Date(borrowDate);
        date.setDate(date.getDate() + 14);
        return date.toISOString().split('T')[0];
    };

    const handleMemberSelect = (member) => {
        setSelectedMember(member);
        setMemberSearch(member.name);
        setShowMemberDropdown(false);
    };

    const handleBookSelect = (book) => {
        setSelectedBook(book);
        setBookSearch(book.title);
        setShowBookDropdown(false);
    };

    const handleBorrowingDateChange = (date) => {
        setBorrowingDate(date);
        setDueDate(calculateDueDate(date));
    };

    const handleIssueBook = (e) => {
        e.preventDefault();
        if (!selectedMember || !selectedBook) {
            alert("Please select both a member and a book");
            return;
        }
        const eligibility = getMemberEligibility(selectedMember);
        if (!eligibility.eligible) {
            alert(`Cannot issue book: ${eligibility.reason}`);
            return;
        }
        if (selectedBook.availableCopies === 0) {
            alert("Book is not available");
            return;
        }
        console.log("Issue Book:", {
            member: selectedMember,
            book: selectedBook,
            borrowingDate,
            dueDate,
        });
        alert("Book issued successfully!");
        // Reset form
        setSelectedMember(null);
        setSelectedBook(null);
        setMemberSearch("");
        setBookSearch("");
        setBorrowingDate(new Date().toISOString().split('T')[0]);
        setDueDate("");
    };

    return (
        <div className="admin-dashboard">
            <section className="admin-panel">
                <h2 className="admin-panel-title">Issue Book</h2>
                <form onSubmit={handleIssueBook} className="admin-modal-form">
                    {/* Member Selection */}
                    <div className="admin-form-group">
                        <label>Select Member *</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={memberSearch}
                                onChange={(e) => {
                                    setMemberSearch(e.target.value);
                                    setShowMemberDropdown(true);
                                }}
                                onFocus={() => setShowMemberDropdown(true)}
                                className="admin-search-input"
                                style={{ width: "100%", background: "#FEF9C3" }}
                            />
                            {showMemberDropdown && memberSearch && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    background: "var(--surface)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    boxShadow: "var(--shadow)",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    zIndex: 10,
                                    marginTop: "4px"
                                }}>
                                    {filteredMembers.length === 0 ? (
                                        <div style={{ padding: "14px", color: "var(--text)" }}>No members found</div>
                                    ) : (
                                        filteredMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                onClick={() => handleMemberSelect(member)}
                                                style={{
                                                    padding: "12px 14px",
                                                    cursor: "pointer",
                                                    transition: "background 0.2s ease",
                                                    borderBottom: "1px solid var(--border)"
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = "var(--accent-bg)"}
                                                onMouseLeave={(e) => e.target.style.background = "transparent"}
                                            >
                                                <div style={{ fontWeight: 600, color: "var(--text-h)" }}>{member.name}</div>
                                                <div style={{ fontSize: "13px", color: "var(--text)" }}>{member.email}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Member Eligibility Info */}
                    {selectedMember && (
                        <div style={{
                            padding: "14px",
                            background: "#FEF3C7",
                            borderRadius: "8px",
                            border: "1px solid var(--border)"
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: "8px", color: "var(--text-h)" }}>Member Information</div>
                            <div style={{ fontSize: "14px", color: "var(--text)" }}>
                                <div>Status: <span className={`admin-badge admin-badge-${selectedMember.status.toLowerCase() === 'active' ? 'active' : 'suspended'}`}>{selectedMember.status}</span></div>
                                <div>Borrowed: {selectedMember.borrowedCount}/{selectedMember.maxBorrow}</div>
                                <div>Fines: <span className={selectedMember.fines > 0 ? "admin-fine-amount" : "admin-fine-zero"}>Rs. {selectedMember.fines}</span></div>
                                <div style={{ marginTop: "8px", fontWeight: 600 }}>
                                    {(() => {
                                        const eligibility = getMemberEligibility(selectedMember);
                                        return (
                                            <span style={{ color: eligibility.eligible ? "var(--status-success)" : "var(--status-error)" }}>
                                                {eligibility.reason}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Book Selection */}
                    <div className="admin-form-group">
                        <label>Select Book *</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="text"
                                placeholder="Search by title, author, or ISBN..."
                                value={bookSearch}
                                onChange={(e) => {
                                    setBookSearch(e.target.value);
                                    setShowBookDropdown(true);
                                }}
                                onFocus={() => setShowBookDropdown(true)}
                                className="admin-search-input"
                                style={{ width: "100%", background: "#FEF9C3" }}
                            />
                            {showBookDropdown && bookSearch && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    background: "var(--surface)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    boxShadow: "var(--shadow)",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    zIndex: 10,
                                    marginTop: "4px"
                                }}>
                                    {filteredBooks.length === 0 ? (
                                        <div style={{ padding: "14px", color: "var(--text)" }}>No books found</div>
                                    ) : (
                                        filteredBooks.map((book) => (
                                            <div
                                                key={book.id}
                                                onClick={() => handleBookSelect(book)}
                                                style={{
                                                    padding: "12px 14px",
                                                    cursor: "pointer",
                                                    transition: "background 0.2s ease",
                                                    borderBottom: "1px solid var(--border)"
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = "var(--accent-bg)"}
                                                onMouseLeave={(e) => e.target.style.background = "transparent"}
                                            >
                                                <div style={{ fontWeight: 600, color: "var(--text-h)" }}>{book.title}</div>
                                                <div style={{ fontSize: "13px", color: "var(--text)" }}>{book.author} • {book.isbn}</div>
                                                <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                                    Available: <span className={`admin-badge admin-badge-${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>{book.availableCopies}/{book.totalCopies}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Book Availability Info */}
                    {selectedBook && (
                        <div style={{
                            padding: "14px",
                            background: "#FEF3C7",
                            borderRadius: "8px",
                            border: "1px solid var(--border)"
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: "8px", color: "var(--text-h)" }}>Book Information</div>
                            <div style={{ fontSize: "14px", color: "var(--text)" }}>
                                <div>Title: {selectedBook.title}</div>
                                <div>Author: {selectedBook.author}</div>
                                <div>ISBN: {selectedBook.isbn}</div>
                                <div>Available Copies: <span className={`admin-badge admin-badge-${selectedBook.availableCopies > 0 ? 'available' : 'unavailable'}`}>{selectedBook.availableCopies}/{selectedBook.totalCopies}</span></div>
                            </div>
                        </div>
                    )}

                    {/* Date Selection */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="admin-form-group">
                            <label>Borrowing Date *</label>
                            <input
                                type="date"
                                value={borrowingDate}
                                onChange={(e) => handleBorrowingDateChange(e.target.value)}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Due Date *</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-modal-footer">
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() => {
                                setSelectedMember(null);
                                setSelectedBook(null);
                                setMemberSearch("");
                                setBookSearch("");
                                setBorrowingDate(new Date().toISOString().split('T')[0]);
                                setDueDate("");
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={!selectedMember || !selectedBook}
                        >
                            Issue Book
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default IssueBooks;
