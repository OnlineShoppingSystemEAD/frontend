import React, { useState } from "react";
import userService from "../../api/services/UserService"; // Import userService for API calls
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        setError("");

        try {
            // Call forgotPassword API
            await userService.forgotPassword({ email });
            navigate("/reset-password");
            setStatus("Password reset email sent. Please check your inbox.");
        } catch (err) {
            console.error("Error during forgot password request:", err);
            setError(err.message || "Failed to send password reset email.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 text-base border border-gray-300 rounded-md w-64 mb-4"
                    required
                />
                {status && <div className="text-green-500 mb-4">{status}</div>}
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <button
                    type="submit"
                    className="flex-1 px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-black transition-all duration-300"
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
