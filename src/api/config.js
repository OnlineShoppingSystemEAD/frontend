// Base URL for the API
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined. Check your .env file.");
}
// Uses environment variable if set, otherwise defaults to localhost

/**
 * Function to generate default headers for API requests.
 * Includes content type and authorization token if available.
 * @returns {Object} Headers for the API request
 */
export const getDefaultHeaders = () => {
    try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        return {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token exists
        };
    } catch (error) {
        console.error("Error generating headers: ", error);
        return {
            "Content-Type": "application/json",
        }; // Return default headers if there's an issue
    }
};

/**
 * Function to check if a token exists and is valid.
 * @returns {boolean} True if a token exists and is not expired, otherwise false.
 */
export const isTokenValid = () => {
    try {
        const token = localStorage.getItem("token");
        const expiration = localStorage.getItem("tokenExpiration");
        if (!token || !expiration) return false;

        const currentTime = new Date().getTime();
        return currentTime < parseInt(expiration); // Check if the current time is before expiration
    } catch (error) {
        console.error("Error validating token: ", error);
        return false;
    }
};

/**
 * Function to remove tokens from storage (for logout or invalidation).
 */
export const clearTokens = () => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiration");
    } catch (error) {
        console.error("Error clearing tokens: ", error);
    }
};
