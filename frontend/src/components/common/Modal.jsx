import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal modal--${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal__header">
                    <h3 className="modal__title">{title}</h3>
                    <button className="modal__close" onClick={onClose} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="modal__body">
                    {children}
                </div>
                {footer && (
                    <div className="modal__footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
