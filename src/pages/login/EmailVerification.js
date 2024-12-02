import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../api/services/UserService";

const EmailVerification = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    // Retrieve stored form data from localStorage
    const getStoredSignupForm = () => {
        const storedForm = localStorage.getItem("signupForm");
        return storedForm ? JSON.parse(storedForm) : null;
    };

    // Handle verification and signup
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setStatus(""); // Reset status

        // Check if the verification code is 6 digits
        if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
            setStatus("Please enter a valid 6-digit verification code.");
            return;
        }

        try {

            // Retrieve stored form data
            const storedForm = getStoredSignupForm();
            if (storedForm) {
                // Verify the code using the backend service
                const reqResPayload = {
                    email: storedForm.email, // Properly define the key-value pair
                    verificationCode, // Add the verificationCode
                };
                await userService.verifyEmail(reqResPayload);
                setStatus("Email verified successfully!");

                console.log("Sign Up successful:", storedForm);

                // Clear stored form data
                localStorage.removeItem("signupForm");

                // Navigate to login or home page
                navigate("/login");
            } else {
                setStatus("No stored signup data found.");
            }
        } catch (error) {
            console.error("Verification or signup failed:", error);
            setStatus(error.message || "Verification or signup failed.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
            <p className="text-center mb-6">
                Enter the 6-digit verification code sent to your email.
            </p>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="p-2 text-base border border-gray-300 rounded-md w-64 text-center mb-4"
                    maxLength={6}
                    required
                />
                {status && (
                    <div
                        className={`mb-4 ${
                            status.includes("successfully") ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {status}
                    </div>
                )}
                <button
                    type="submit"
                    className="flex-1 px-12 py-3 text-white bg-purple-600 rounded-lg hover:bg-black transition-all duration-300"
                >
                    Verify
                </button>
            </form>
        </div>
    );
};

export default EmailVerification;
