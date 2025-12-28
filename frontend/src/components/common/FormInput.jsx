import React from 'react';
import './FormInput.css';

export const Input = ({
    label,
    error,
    required,
    className = '',
    ...props
}) => {
    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="form-required">*</span>}
                </label>
            )}
            <input
                className={`form-input ${error ? 'form-input--error' : ''}`}
                {...props}
            />
            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export const Select = ({
    label,
    error,
    required,
    options = [],
    className = '',
    ...props
}) => {
    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="form-required">*</span>}
                </label>
            )}
            <select
                className={`form-select ${error ? 'form-input--error' : ''}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export const Textarea = ({
    label,
    error,
    required,
    className = '',
    ...props
}) => {
    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="form-required">*</span>}
                </label>
            )}
            <textarea
                className={`form-textarea ${error ? 'form-input--error' : ''}`}
                {...props}
            />
            {error && <span className="form-error">{error}</span>}
        </div>
    );
};
