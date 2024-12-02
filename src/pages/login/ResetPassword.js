import React, { useState } from "react";
import userService from "../../api/services/UserService"; // Import userService for API calls
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        setError("");

        // Validate passwords
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            // Construct payload
            const reqResPayload = {
                email,
                verificationCode,
                newPassword,
            };

            console.log("Sending payload to backend:", reqResPayload);

            // Call the API
            await userService.forgotPasswordVerify(reqResPayload);
            setStatus("Password reset successfully!");
            navigate("/login");
        } catch (err) {
            console.error("Error resetting password:", err);
            setError(
                err.response?.data?.message ||
                "Failed to reset password. Please try again."
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 text-base border border-gray-300 rounded-md w-64 mb-4"
                    required
                />
                <input
                    type="text"
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="p-2 text-base border border-gray-300 rounded-md w-64 mb-4"
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="p-2 text-base border border-gray-300 rounded-md w-64 mb-4"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-2 text-base border border-gray-300 rounded-md w-64 mb-4"
                    required
                />
                {status && <div className="text-green-500 mb-4">{status}</div>}
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <button
                    type="submit"
                    className="w-full px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-black transition-all duration-300"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
