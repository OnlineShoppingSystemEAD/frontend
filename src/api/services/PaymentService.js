import axios from "axios";
import { getDefaultHeaders } from "../config";

// Use the base URL from the environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

if (!process.env.REACT_APP_API_BASE_URL) {
    console.warn("API_BASE_URL is not defined in the .env file. Using default localhost.");
}

// Create a base Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: getDefaultHeaders(),
});

// Centralized error handler
const handleError = (error) => {
    const errorMessage = error.response?.data || error.message || "An error occurred";
    console.error(errorMessage);
    throw new Error(errorMessage);
};

const PaymentService = {
    // Confirm payment
    confirmPayment: async (orderId, amount) => {
        try {
            const response = await apiClient.post("/payments/confirm",  {
                params: { orderId, amount },
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // List all payments
    listAllPayments: async () => {
        try {
            const response = await apiClient.get("/payments");
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Retrieve a payment by ID
    getPaymentById: async (paymentId) => {
        try {
            const response = await apiClient.get(`/payments/${paymentId}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Process a new payment
    processPayment: async (paymentRequest) => {
        try {
            const response = await apiClient.post("/payments", paymentRequest);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Update payment details
    updatePayment: async (paymentId, updatedPayment) => {
        try {
            const response = await apiClient.put(`/payments/${paymentId}`, updatedPayment);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Delete a payment
    deletePayment: async (paymentId) => {
        try {
            const response = await apiClient.delete(`/payments/${paymentId}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Save a payment method
    savePaymentMethod: async (paymentMethodRequest) => {
        try {
            const response = await apiClient.post("/payments/methods", paymentMethodRequest);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Get all order IDs by user ID
    getAllOrderIdsByUserId: async (userId) => {
        try {
            const response = await apiClient.get(`/payments/orders/${userId}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Get pending and paid delivery order IDs by user ID
    getPendingAndPaidDeliveryOrderIdsByUserId: async (userId) => {
        try {
            const response = await apiClient.get(`/payments/delivery-orders/${userId}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
};

export default PaymentService;
