// CategoryModal.js
import React from 'react';
import '../../../styles/categoryModal.css'; // Create a CSS file for modal styling

const CategoryModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Return nothing if the modal is not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add a Category</h2>
                <form>
                    <div className="form-group">
                        <input type="text" placeholder="Category Name" className="input-field" />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Add an Image" className="input-field" />
                        <button type="button" className="add-image-button">+</button>
                    </div>
                    <div className="button-group">
                        <button type="button" onClick={onClose} className="modal-button">Back</button>
                        <button type="submit" className="modal-button">Done</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
