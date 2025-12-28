import React from 'react';
import './Card.css';

const Card = ({ children, variant = 'default', className = '', onClick }) => {
    return (
        <div
            className={`card card--${variant} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
