// CategoryGrid.js
import React, { useState } from 'react';
import '../../styles/categoryGrid.css';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";
import CategoryModal from '../../components/admin/category/CategoryModal';
import DeleteConfirmationModal from '../../components/admin/category/DeleteConfirmationModal';
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categoriesData = [
    { id: 1, name: 'Women', image: 'https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/400-600/217422343--1--1715767169.jpeg' },
    { id: 2, name: 'Men', image: 'https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/400-600/218524077--1--1717662156.jpeg' },
    { id: 3, name: 'Bags', image: 'https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/400-600/178115892--1--1707975904.jpeg' },
    { id: 4, name: 'Shoes', image: 'https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/400-600/219677067--1--1727954307.jpeg' },
    { id: 5, name: 'Watches', image: 'https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/400-600/SS07S118--1--1696567461.jpeg' },
    { id: 6, name: 'Add', image: 'https://cdn-icons-png.flaticon.com/512/64/64580.png' },
];

const CategoryGrid = () => {
    const [categories, setCategories] = useState(categoriesData);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    //const openModal = () => setModalOpen(true);
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
        setCategories(categories.filter(cat => cat.name !== selectedCategory.name));
        closeDeleteModal();
    };

    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        // Navigate to the category details page and pass the selected category data
        navigate(`/category/${category.id}`, { state: { category } });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="category-grid">
                    {categories.map((category, index) => (
                        <div className="category-item" key={index} onClick={() => handleCategoryClick(category)}>
                            <h1 className="category-name">{category.name}</h1>
                            <img src={category.image} alt={category.name} className="category-image" />
                            {category.name !== 'Add' && (
                                <FaTrash className="icon-trash" onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteModal(category);
                                }} />
                            )}
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
