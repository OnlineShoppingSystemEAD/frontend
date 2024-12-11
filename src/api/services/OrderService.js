import axios from "axios";
import { getDefaultHeaders } from "../config";

// Use the base URL from the environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined in the .env file.");
}

// Service for Shopping Cart APIs
const ShoppingCartService = {
    // Get shopping cart items by user ID
    getShoppingCartByUserId: async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/shoppingCart/${userId}`, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching shopping cart items:", error.response?.data || error.message);
            throw error;
        }
    },

    // Add an item to the shopping cart
    createShoppingCartItem: async (itemData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/shoppingCart/addItem`, itemData, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error adding item to shopping cart:", error.response?.data || error.message);
            throw error;
        }
    },

    // Update an item in the shopping cart
    // Update an item in the shopping cart
    updateShoppingCart: async (id, updatedQuantity) => {
        try {
            // Construct the payload if the API expects it in the body
            const payload = { updatedQuantity };

            const response = await axios.put(
                `${API_BASE_URL}/api/shoppingCart/${id}`,
                payload, // Include the updated quantity in the request body
                {
                    headers: getDefaultHeaders(),
                    params: { updatedQuantity },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating shopping cart item:", error.response?.data || error.message);
            throw error;
        }
    },

    // Delete an item from the shopping cart
    deleteItemFromShoppingCart: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/shoppingCart/${id}`, {
                headers: getDefaultHeaders(),
            });
            return response;
        } catch (error) {
            console.error("Error deleting shopping cart item:", error.response?.data || error.message);
            throw error;
        }
    },
};

// Service for Order APIs
const OrderService = {
    // Get all orders
    getAllOrders: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/order/`, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching orders:", error.response?.data || error.message);
            throw error;
        }
    },
    // Get order by order ID
    getOrderByOrderId: async (orderId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/order/${orderId}`, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching order by order ID:", error.response?.data || error.message);
            throw error;
        }
    },
    // Create a new order
    createOrder: async (userId, orderData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/order/createOrder/${userId}`, orderData, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error.response?.data || error.message);
            throw error;
        }
    },

    // Update order status
    updateOrderStatus: async (orderId, updatedStatus) => {
        try {
            // Correct payload structure
            const payload = {
                orderId, // Include the orderId explicitly in the request body
                orderStatus: updatedStatus // Ensure field name matches backend's DTO
            };

            // Call API with updated payload
            const response = await axios.put(`${API_BASE_URL}/api/order/${orderId}`, payload, {
                headers: getDefaultHeaders(),
            });
            return response;
        } catch (error) {
            console.error("Error updating order status:", error.response?.data || error.message);
            throw error;
        }
    },

    // Delete an order
    deleteOrder: async (orderId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/order/deleteOrder`, {
                headers: getDefaultHeaders(),
                params: { orderId },
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting order:", error.response?.data || error.message);
            throw error;
        }
    },
};

// Service for Order Items APIs
const OrderItemsService = {
    // Create a new order item
    createOrderItem: async (orderItemData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/orderItems`, orderItemData, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error creating order item:", error.response?.data || error.message);
            throw error;
        }
    },
    // Get products by category with pagination
    getProductsByOrder: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/orderItems/${id}`, {
                headers: getDefaultHeaders(),
            });
            // The backend returns a ResponseDTO object; extract the items field
            return response.data; // Adjust based on ResponseDTO structure
        } catch (error) {
            console.error("Error fetching products by category:", error.response?.data || error.message);
            throw error;
        }
    },

};

export { ShoppingCartService, OrderService, OrderItemsService };
