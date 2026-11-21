import { NavLink } from "react-router-dom";

const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/books", label: "Manage Books" },
    { to: "/admin/authors-categories", label: "Authors & Categories" },
    { to: "/admin/users", label: "Librarians & Members" },
    { to: "/admin/borrowings", label: "Borrowing Records" },
    { to: "/admin/overdue", label: "Overdue & Fines" },
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <p className="sidebar-title">Admin Panel</p>
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
