import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import userService from "../api/services/UserService";

const PrivateRoute = ({
    children,
    allowedRoles,
    disallowedRoles,
    redirectIfAuthenticated = false,
}) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                // Verify the token using the userService
                const response = await userService.verifyToken();
                setUserRole(response.role); // Extract role from verification response
                setIsVerified(true); // Token is valid
            } catch (error) {
                console.error("Token verification failed:", error);
                setIsVerified(false); // Token is invalid or expired
            } finally {
                setIsLoading(false); // Stop loading once verification is complete
            }
        };

        verifyToken();
    }, []);

    // Show a loading message while verifying the token
    if (isLoading) {
        return (
            <div style={{ position: "relative", width: "100%", height: "100vh", textAlign: "center" }}>
                <p style={{ marginTop: "20px", fontSize: "18px", color: "#555" }}>Verifying your session...</p>
            </div>
        );
    }

    // Redirect authenticated users if `redirectIfAuthenticated` is true
    if (redirectIfAuthenticated && isVerified) {
        return <Navigate to="/" replace />;
    }

    // Redirect to home page (`/`) if the token is invalid or expired
    if (!isVerified) {
        return <Navigate to="/" replace />;
    }

    // Redirect to home page (`/`) if the user's role is disallowed for this route
    if (disallowedRoles && disallowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    // Redirect to home page (`/`) if the user's role is not allowed to access this route
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    // Allow access to the route
    return children;
};

export default PrivateRoute;
