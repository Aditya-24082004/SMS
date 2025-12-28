import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
    const sizeStyles = {
        small: { width: '24px', height: '24px', borderWidth: '3px' },
        medium: { width: '40px', height: '40px', borderWidth: '4px' },
        large: { width: '60px', height: '60px', borderWidth: '5px' }
    };

    const spinnerStyle = sizeStyles[size] || sizeStyles.medium;

    if (fullScreen) {
        return (
            <div className="flex flex-center" style={{ minHeight: '100vh' }}>
                <div className="spinner" style={spinnerStyle}></div>
            </div>
        );
    }

    return <div className="spinner" style={spinnerStyle}></div>;
};

export default LoadingSpinner;
