import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
    const { email, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-logo">
                    <span className="logo-icon">📚</span>
                    <span className="logo-text">Library Management</span>
                </div>
                <div className="header-user">
                    <span className="user-email">{email}</span>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
