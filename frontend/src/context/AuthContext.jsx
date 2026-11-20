
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");

        if (token) {
            return { token, email, role };
        }

        return null;
    });

    // Store login response
    const login = (data) => {
        const userData = {
            token: data.token,
            email: data.email,
            role: data.role
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);

        setAuth(userData);
    };

    // Clear login details
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        setAuth(null);
    };

    const value = {
        auth,
        token: auth?.token,
        email: auth?.email,
        role: auth?.role,
        isAuthenticated: !!auth?.token,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access authentication
export const useAuth = () => {
    return useContext(AuthContext);
};
