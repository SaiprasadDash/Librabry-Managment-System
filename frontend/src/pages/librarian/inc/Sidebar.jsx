import { NavLink } from "react-router-dom";

const menuItems = [
    { to: "/librarian/dashboard", label: "Dashboard" },
    { to: "/librarian/books", label: "Book Management" },
    { to: "/librarian/members", label: "Member Management" },
    { to: "/librarian/issue", label: "Issue Books" },
    { to: "/librarian/return", label: "Return Books" },
    { to: "/librarian/history", label: "Borrowing History" },
    { to: "/librarian/overdue", label: "Overdue Books" },
    { to: "/librarian/fines", label: "Fine Management" },
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <p className="sidebar-title">Librarian Panel</p>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
