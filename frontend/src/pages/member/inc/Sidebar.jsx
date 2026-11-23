import { NavLink } from "react-router-dom";

const menuItems = [
    { to: "/member/home", label: "Dashboard" },
    { to: "/member/books", label: "All Books" },
    { to: "/member/reservations", label: "Book Reservations" },
    { to: "/member/borrow", label: "Borrow & Return" },
    { to: "/member/due", label: "My Due Books" },
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <p className="sidebar-title">Member Panel</p>
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
