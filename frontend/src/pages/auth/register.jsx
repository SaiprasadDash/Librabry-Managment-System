import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiconnect from "../../servises/ApiConnect";
import { useAuth } from "../../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
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
        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        } else if (form.name.trim().length > 100) {
            newErrors.name = "Name cannot exceed 100 characters";
        }
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 8 || form.password.length > 72) {
            newErrors.password = "Password must be between 8 and 72 characters";
        }
        if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = "Passwords do not match";
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
            const result = await apiconnect.postData("/api/auth/register", {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
            });

            login(result);

            // Redirect based on role (registration typically creates MEMBER)
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
            setMessage(data?.message || "Unable to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <form className="register-card" onSubmit={handleSubmit} noValidate>
                <div className="register-header">
                    <div className="register-logo">📚</div>
                    <h2 className="register-title">Create Account</h2>
                    <p className="register-subtitle">Join the library as a member</p>
                </div>

                {message && <div className="register-alert">{message}</div>}

                <div className="register-field">
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                    />
                    {errors.name && <span className="register-error">{errors.name}</span>}
                </div>

                <div className="register-field">
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
                    {errors.email && <span className="register-error">{errors.email}</span>}
                </div>

                <div className="register-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                    {errors.password && <span className="register-error">{errors.password}</span>}
                </div>

                <div className="register-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                        <span className="register-error">{errors.confirmPassword}</span>
                    )}
                </div>

                <button className="register-button" type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>

                <p className="register-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
