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
    getProductsByCategory: async (categoryId, pageNo = 0, pageSize = 16) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/items/category/${categoryId}`, {
                params: {
                    pageNo,
                    pageSize,
                },
                headers: getDefaultHeaders(),
            });
            // The backend returns a ResponseDTO object; extract the items field
            return response.data?.data || []; // Adjust based on ResponseDTO structure
        } catch (error) {
            console.error("Error fetching products by category:", error.response?.data || error.message);
            throw error;
        }
    },
    // Create a new item (Admin Only)
    createItem: async (itemData, images) => {
        try {
            // Create a FormData object
            const formData = new FormData();

            // Append the item data as a JSON string
            formData.append("item", new Blob([JSON.stringify(itemData)], { type: "application/json" }));

            // Append each image file to the form data
            images.forEach((image, index) => {
                formData.append("images", image);
            });

            // Make the POST request with multipart/form-data
            const response = await axios.post(`${API_BASE_URL}/admin/items`, formData, {
                headers: {
                    ...getDefaultHeaders(),
                    "Content-Type": "multipart/form-data", // Ensure Content-Type is set for FormData
                },
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
            return response.data || []; // Adjust based on ResponseDTO structure
        } catch (error) {
            console.error("Error fetching categories:", error.response || error.message);
            throw error;
        }
    },

    // Get category by ID
    getCategoryById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/categories/${id}`, {
                headers: getDefaultHeaders(),
            });
            return response; // Adjust based on ResponseDTO structure
        } catch (error) {
            console.error("Error fetching category by ID:", error.response?.data || error.message);
            throw error;
        }
    },

    // Create a new category
    createCategory: async (categoryData, image, userId, role) => {
        try {
            const formData = new FormData();
            formData.append("category", new Blob([JSON.stringify(categoryData)], { type: "application/json" }));
            if (image) {
                formData.append("image", image);
            }
            formData.append("userId", userId);
            formData.append("role", role);

            const response = await axios.post(`${API_BASE_URL}/api/categories`, formData, {
                headers: {
                    ...getDefaultHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });
            return response; // Adjust based on ResponseDTO structure
        } catch (error) {
            console.error("Error creating category:", error.response?.data || error.message);
            throw error;
        }
    },

    // Update a category by ID
    updateCategory: async (id, categoryData, image, userId, role) => {
        try {
            const formData = new FormData();
            formData.append("category", new Blob([JSON.stringify(categoryData)], { type: "application/json" }));
            if (image) {
                formData.append("image", image);
            }
            formData.append("userId", userId);
            formData.append("role", role);

            const response = await axios.put(`${API_BASE_URL}/api/categories/${id}`, formData, {
                headers: {
                    ...getDefaultHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });
            return response; // Adjust based on ResponseDTO structure
        } catch (error) {
            console.error("Error updating category:", error.response?.data || error.message);
            throw error;
        }
    },

    // Delete a category by ID
    deleteCategory: async (id, userId, role) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/categories/${id}`, {
                params: { userId, role },
                headers: getDefaultHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting category:", error.response?.data || error.message);
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
