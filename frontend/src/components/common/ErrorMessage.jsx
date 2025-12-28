import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-danger)',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 'bold'
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
