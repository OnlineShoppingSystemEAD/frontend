import axios from "axios";
import { getDefaultHeaders } from "../config";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ItemService = {
    // Get items with pagination
    getItems: async (pageNo = 0, pageSize = 16) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/items`, {
                params: { pageNo, pageSize },
                headers: getDefaultHeaders(),
            });
            return response.data; // Assuming the API returns the items in the `data` field
        } catch (error) {
            console.error('Error fetching items:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get a specific item
    getItemById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/items/${id}`, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching item:", error.response?.data || error.message);
            throw error;
        }
    },

    // Get items by category with pagination
    getItemsByCategory: async (categoryId, pageNo, pageSize) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/items/category/${categoryId}`, {
                headers: getDefaultHeaders(),
                params: { pageNo, pageSize }, // Pass pagination params
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching items by category:", error.response?.data || error.message);
            throw error;
        }
    },

    // Create a new item (Admin Only)
    createItem: async (itemData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/items`, itemData, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error creating item:", error.response?.data || error.message);
            throw error;
        }
    },
    getCategories: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/categories`, {
                headers: getDefaultHeaders(),
            });
            console.log('API Response:', response); // Debugging log
            return response.data; // Adjust this line to match your API's response structure
        } catch (error) {
            console.error("Error fetching items by category:", error.response?.data || error.message);
            throw error;
        }
    },
    // Update an existing item (Admin Only)
    updateItem: async (id, itemData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/admin/items/${id}`, itemData, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error updating item:", error.response?.data || error.message);
            throw error;
        }
    },

    // Delete an item (Admin Only)
    deleteItem: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/admin/items/${id}`, {
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting item:", error.response?.data || error.message);
            throw error;
        }
    },
};

export default ItemService;
