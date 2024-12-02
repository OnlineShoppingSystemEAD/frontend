import axios from "axios";
import { getDefaultHeaders } from "../config";

// Use the base URL from the environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined in the .env file.");
}

const PaymentService = {
    // Confirm payment
    confirmPayment: async (paymentId, orderId, amount) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/payments/${paymentId}/confirm`,
                null, // No request body, as parameters are passed as query params
                {
                    params: { orderId, amount },
                    headers: getDefaultHeaders(),
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error confirming payment:", error.response?.data || error.message);
            throw error;
        }
    },
};

export default PaymentService;
