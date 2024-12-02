// DeleteConfirmationModal.js
import React from 'react';
import '../../../styles/deleteConfirmationModal.css'; // CSS file for styling the modal

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, categoryName }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-delete-confirmation-modal">
            <div className="modal-content-container">
                <h2 className="warning-title">Warning</h2>
                <p>This will delete all items corresponding to category "<strong>{categoryName}</strong>".</p>
                <p>Do you want to proceed?</p>
                <div className="button-group">
                    <button type="button" onClick={onClose} className="modal-button">Back</button>
                    <button type="button" onClick={onConfirm} className="modal-button">Proceed</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
