import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/'); // Navigate to the home page or any other route you prefer
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                color: '#333',
            }}
        >
            <h1 style={{ fontSize: '6rem', fontWeight: 'bold' }}>404</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                Oops! The page you're looking for doesn't exist.
            </p>
            <button
                onClick={goHome}
                style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    color: '#fff',
                    backgroundColor: '#007bff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Go Back Home
            </button>
        </div>
    );
};

export default NotFound;
