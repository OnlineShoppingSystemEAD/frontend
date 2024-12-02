import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../api/services/UserService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await userService.signIn({ email, password });
      localStorage.setItem("token", response.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">SHOPZEN</h1>
      <form className="w-full max-w-sm space-y-4" onSubmit={handleLoginSubmit}>
        <input
          type="text"
          placeholder="Username / Email"
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
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex justify-between space-x-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-black transition-all duration-300"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="flex-1 px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-black transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
        <div className="mt-4 text-center">
  <a
    href="/forgot-password"
    className="text-purple-600 hover:text-black no-underline transition-all duration-300"
  >
    Forgot Password?
  </a>
</div>

      </form>
    </div>
  );
};

export default Login;
