import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode
import { API_BASE_URL, getDefaultHeaders } from "../config";

const userService = {
    /**
     * User signup
     * @param {Object} signUpRequest - { email: string, password: string, username: string }
     * @returns {Promise<Object>} - Signup response
     * @returns {Promise<Object>} - List of user profiles.
     */
    signUp: async (signUpRequest) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/signup`,
                signUpRequest,
                {
                    headers: getDefaultHeaders(),
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error during signup:", error.response?.data || error.message);
            throw error.response?.data || new Error("Signup failed");
        }
    },

    /**
     * User signIn
     * @param {Object} signInRequest - { email: string, password: string }
     * @returns {Promise<Object>} - SignIn response
     */
    signIn: async (signInRequest) => {
        console.log(API_BASE_URL)
        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/signIn`,
                signInRequest,
                {
                    headers: getDefaultHeaders(),
                }
            );
            const { token, refreshToken, expirationTime } = response.data;

            // Save the token in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem(
                "tokenExpiration",
                new Date().getTime() + parseInt(expirationTime) * 60 * 60 * 1000 // Convert expiration time to milliseconds
            );

            return response.data;
        } catch (error) {
            console.error("Error during signIn:", error.response?.data || error.message);
            throw error.response?.data || new Error("SignIn failed");
        }
    },

    /**
     * Refresh authentication token
     * Automatically refreshes the token when it is expired
     * @returns {Promise<Object>} - Refresh token response
     */
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const response = await axios.post(
                `${API_BASE_URL}/auth/token/refresh`,
                { refreshToken },
                {
                    headers: getDefaultHeaders(),
                }
            );

            const { token, refreshToken: newRefreshToken, expirationTime } = response.data;

            // Update tokens in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", newRefreshToken);
            localStorage.setItem(
                "tokenExpiration",
                new Date().getTime() + parseInt(expirationTime) * 60 * 60 * 1000
            );

            return response.data;
        } catch (error) {
            console.error("Error during token refresh:", error.response?.data || error.message);
            throw error.response?.data || new Error("Token refresh failed");
        }
    },

    /**
     * Verify token validity
     * @returns {Promise<Object>} - Verification response
     */
    verifyToken: async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token available");
            }

            const response = await axios.post(
                `${API_BASE_URL}/auth/verify-token`,
                { token },
                {
                    headers: getDefaultHeaders(),
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error during token verification:", error.response?.data || error.message);
            throw error.response?.data || new Error("Token verification failed");
        }
    },

    /**
     * Check if the token is still valid
     * @returns {boolean} - True if token is valid, false otherwise
     */
    isTokenValid: () => {
        const tokenExpiration = localStorage.getItem("tokenExpiration");
        if (!tokenExpiration) {
            return false;
        }

        const currentTime = new Date().getTime();
        return currentTime < parseInt(tokenExpiration); // Check if current time is before expiration time
    },

    /**
     * Log out the user by clearing tokens from localStorage.
     */
    logout: () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("tokenExpiration");
            console.log("User logged out successfully.");
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    },

    /**
     * Get the role of the logged-in user.
     * @returns {string|null} - Returns the user role (e.g., "ADMIN", "USER") or null if no valid token is found.
     */
    getUserRole: () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return null;
            }

            // Decode the token to extract the role
            const decodedToken = jwtDecode(token);
            return decodedToken.role || null; // Return the role or null if not present
        } catch (error) {
            console.error("Error decoding token:", error.message);
            return null;
        }
    },
    getUserId: () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return null;
            }

            // Decode the token to extract the userId
            const decodedToken = jwtDecode(token);
            return decodedToken.userId || null; // Return the userId or null if not present
        } catch (error) {
            console.error("Error decoding token:", error.message);
            return null;
        }
    },

    /**
     * Check if the logged-in user is an admin.
     * @returns {boolean} - True if the user is an admin, false otherwise.
     */
    isAdmin: () => {
        const role = userService.getUserRole();
        return role === "ADMIN";
    },
    getAllUserProfiles: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching user profiles:", error);
            throw error;
        }
    },

    /**
     * Get user profile by ID.
     * @param {number} id - User ID.
     * @param {number} userId - Authenticated User ID.
     * @param {string} role - User role.
     * @returns {Promise<Object>} - User profile response.
     */
    getUserProfileById: async (id, userId, role) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${id}/profile`, {
                params: { userId, role },
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile by ID:", error);
            throw error;
        }
    },

    /**
     * Create a new user profile.
     * @param {Object} userProfile - User profile data.
     * @returns {Promise<Object>} - Response data.
     */
    createUserProfile: async (userProfile) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/profile`, userProfile, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }
    },

    /**
     * Update a user profile by ID.
     * @param {number} id - User ID.
     * @param formData
     * @returns {Promise<Object>} - Response data.
     */
    updateUserProfile: async (id, formData) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            if (!token) {
                throw new Error('User is not authenticated. Token is missing.');
            }

            // Prepare headers without specifying Content-Type
            const headers = {
                Authorization: `Bearer ${token}`, // Include token in the Authorization header
            };

            // Send FormData via Axios
            const response = await axios.put(`${API_BASE_URL}/users/${id}/profile`, formData, {
                headers, // Axios will set the appropriate Content-Type
            });

            return response.data;
        } catch (error) {
            // Detailed error handling
            console.error('Error updating user profile:', error);

            // Handle specific Axios errors
            if (error.response) {
                console.error('Server responded with a status:', error.response.status);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error in request setup:', error.message);
            }

            throw error;
        }
    },

    /**
     * Delete a user profile by ID.
     * @param {number} id - User ID.
     * @returns {Promise<Object>} - Response data.
     */
    deleteUserProfile: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/users/${id}/profile`, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting user profile:", error);
            throw error;
        }
    },

    /**
     * Change password for a user.
     * @param {number} id - User ID.
     * @param {Object} changePasswordReq - Old and new password.
     * @returns {Promise<Object>} - Response data.
     */
    changePassword: async (id, changePasswordReq) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/users/${id}/password`, changePasswordReq, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error changing password:", error);
            throw error;
        }
    },

    /**
     * Forgot password initiation.
     * @param {Object} forgotPasswordReq - Email of the user.
     * @returns {Promise<Object>} - Response data.
     */
    forgotPassword: async (forgotPasswordReq) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/forgot-password`, forgotPasswordReq, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error in forgot password:", error);
            throw error;
        }
    },

    /**
     * Verify forgot password process.
     * @param {Object} reqRes - Verification data.
     * @returns {Promise<Object>} - Response data.
     */
    forgotPasswordVerify: async (reqRes) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/forgot-password/verify`, reqRes, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error in forgot password verification:", error);
            throw error;
        }
    },

    /**
     * Verify email.
     * @param {Object} reqRes - Email and verification code.
     * @returns {Promise<Object>} - Response data.
     */
    verifyEmail: async (reqRes) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/users/verify-email`, // Endpoint
                reqRes, // Ensure the payload matches the backend's expected structure
                {
                    headers: getDefaultHeaders(), // Include any required headers
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error in email verification:", error.response?.data || error.message);
            throw error.response?.data || new Error("Email verification failed");
        }
    },
};

export default userService;
