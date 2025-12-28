const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Registration validation
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['Employee', 'Admin', 'Technician']).withMessage('Invalid role'),
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department name cannot exceed 100 characters'),
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10,15}$/).withMessage('Please provide a valid phone number'),
    validate
];

// Login validation
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    validate
];

// Issue creation validation
const createIssueValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(['Electrical', 'Plumbing', 'HVAC', 'IT', 'Furniture', 'Other'])
        .withMessage('Invalid category'),
    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
    validate
];

// Issue update validation
const updateIssueValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    body('category')
        .optional()
        .isIn(['Electrical', 'Plumbing', 'HVAC', 'IT', 'Furniture', 'Other'])
        .withMessage('Invalid category'),
    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
    body('status')
        .optional()
        .isIn(['Pending', 'Assigned', 'In Progress', 'Completed', 'Rejected'])
        .withMessage('Invalid status'),
    body('location')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
    body('resolutionNotes')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Resolution notes cannot exceed 2000 characters'),
    validate
];

// Comment validation
const addCommentValidation = [
    body('text')
        .trim()
        .notEmpty().withMessage('Comment text is required')
        .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
    validate
];

// MongoDB ObjectId validation
const objectIdValidation = [
    param('id')
        .isMongoId().withMessage('Invalid ID format'),
    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    createIssueValidation,
    updateIssueValidation,
    addCommentValidation,
    objectIdValidation
};
