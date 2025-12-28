import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
    disabled = false,
    loading = false,
    className = '',
    ...props
}) => {
    return (
        <button
            type={type}
            className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <span className="btn__spinner"></span>
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
