import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import userService from "../api/services/UserService";

// Create AuthContext with a default value
export const AuthContext = createContext({
    authToken: null,
    isAuthenticated: false,
    setAuthToken: () => {},
    setIsAuthenticated: () => {},
    clearAuth: () => {},
});

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const validateToken = async () => {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                if (refreshToken) {
                    try {
                        const response = await userService.refreshToken({ refreshToken });
                        const { token: newToken } = response;

                        localStorage.setItem("token", newToken);
                        setAuthToken(newToken);
                        setIsAuthenticated(true);
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        clearAuth();
                    }
                } else {
                    clearAuth();
                }
            } else {
                setAuthToken(token);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Token validation failed:", error);
            clearAuth();
        }
    };

    const clearAuth = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiration");
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        validateToken();
        const interval = setInterval(validateToken, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authToken,
                isAuthenticated,
                setAuthToken,
                setIsAuthenticated,
                clearAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
