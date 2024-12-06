import React, { useState, useEffect } from 'react';
import '../../styles/categoryGrid.css';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";
import CategoryModal from '../../components/admin/category/CategoryModal';
import DeleteConfirmationModal from '../../components/admin/category/DeleteConfirmationModal';
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductService from '../../api/services/ProductService';

const CategoryGrid = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await ProductService.getCategories();
                let data = response.data || []; // Ensure data is initialized as an array

                // "ADD" object to be appended
                const add = {
                    id: 0,
                    name: "NEW",
                    description: "",
                    imageURL: "https://media.istockphoto.com/id/688550958/vector/black-plus-sign-positive-symbol.jpg?s=612x612&w=0&k=20&c=0tymWBTSEqsnYYXWeWmJPxMotTGUwaGMGs6BMJvr7X4="
                };

                // Create a new array with the "ADD" object appended
                data = [...data, add];

                // Update state
                setCategories(data);

            } catch (error) {
                console.error("Error loading categories:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const closeModal = () => setModalOpen(false);
    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setSelectedCategory(null);
        setDeleteModalOpen(false);
    };

    const handleDelete = () => {
        setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
        closeDeleteModal();
    };

    const handleCategoryClick = (category) => {
        navigate(`/category/${category.id}`, { state: { category } });
    };

    if (loading) {
        return <div className="p-6 text-center">Loading categories...</div>;
    }

    if (!Array.isArray(categories) || categories.length === 0) {
        return <div className="p-6 text-center">No categories available.</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="category-grid">
                    {categories.map((category) => (
                        <div
                            className="category-item"
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                        >
                            <h1 className="category-name">{category.name}</h1>
                            <img src={category.imageURL} alt={category.name} className="category-image" />
                            <FaTrash
                                className="icon-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteModal(category);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </main>
            <CategoryModal isOpen={isModalOpen} onClose={closeModal} />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                categoryName={selectedCategory?.name}
            />
            <Footer />
        </div>
    );
};

export default CategoryGrid;
