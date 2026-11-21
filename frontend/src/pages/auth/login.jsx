import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiconnect from "../../servises/ApiConnect";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (!form.password) {
            newErrors.password = "Password is required";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const result = await apiconnect.postData("/api/auth/login", {
                email: form.email.trim(),
                password: form.password,
            });

            // Update auth context
            login(result);

            // Redirect based on role
            const role = result.role;
            if (role === "MEMBER") {
                navigate("/member/home");
            } else if (role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (role === "LIBRARIAN") {
                navigate("/librarian/dashboard");
            } else {
                navigate("/home");
            }
        } catch (err) {
            const data = err.response?.data;
            setErrors(data?.fieldErrors || {});
            setMessage(data?.message || "Unable to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit} noValidate>
                <div className="login-header">
                    <div className="login-logo">📚</div>
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Sign in to your library account</p>
                </div>

                {message && <div className="login-alert">{message}</div>}

                <div className="login-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                    {errors.email && <span className="login-error">{errors.email}</span>}
                </div>

                <div className="login-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                    {errors.password && <span className="login-error">{errors.password}</span>}
                </div>

                <button className="login-button" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="login-footer">
                    Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
