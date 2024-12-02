import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../api/services/UserService";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Perform validations (omitted for brevity)
    try {
      await userService.signUp({ username, email, password });
      navigate("/emailVerification");
    } catch (err) {
      setError(err.message || "Sign Up failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">SHOPZEN</h1>
      <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 text-base border border-gray-300 rounded-md"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 text-base border border-gray-300 rounded-md"
          required
        />
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-base border border-gray-300 rounded-md"
            required
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute cursor-pointer top-1/2 right-3 -translate-y-1/2"
          >
            {passwordVisible ? "🙈" : "👁️"}
          </span>
        </div>
        <div className="relative">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 text-base border border-gray-300 rounded-md"
            required
          />
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="absolute cursor-pointer top-1/2 right-3 -translate-y-1/2"
          >
            {confirmPasswordVisible ? "🙈" : "👁️"}
          </span>
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button
  type="submit"
  className="w-full px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-black transition-all duration-300"
>
  Sign Up
</button>

<div className="flex justify-center mt-4">
  <button
    type="button"
    onClick={() => navigate("/login")}
    className="text-purple-600 hover:text-black no-underline transition-all duration-300"
  >
    Already have an account? Sign In
  </button>
</div>

      </form>
    </div>
  );
};

export default Signup;
