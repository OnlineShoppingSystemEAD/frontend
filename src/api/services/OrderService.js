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
    addItemToShoppingCart: async (itemData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/shoppingCart`, itemData, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error adding item to shopping cart:", error.response?.data || error.message);
            throw error;
        }
    },

    // Update an item in the shopping cart (General update or quantity update)
    updateShoppingCartItem: async (id, itemData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/shoppingCart/${id}`, itemData, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error updating shopping cart item:", error.response?.data || error.message);
            throw error;
        }
    },

    // Delete an item from the shopping cart
    deleteItemFromShoppingCart: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/shoppingCart/${id}`, {
                headers: getDefaultHeaders(),
            });
        } catch (error) {
            console.error("Error deleting shopping cart item:", error.response?.data || error.message);
            throw error;
        }
    },

    // Fetch item details by item ID
    fetchItemDetails: async (itemId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/items/${itemId}`, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching item details:", error.response?.data || error.message);
            throw error;
        }
    },
};

// Service for Order APIs
const OrderService = {
    // Create a new order
    createOrder: async (orderData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/order`, orderData, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error.response?.data || error.message);
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
};

export { ShoppingCartService, OrderService, OrderItemsService };
