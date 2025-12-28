const express = require('express');
const router = express.Router();
const {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    assignIssue,
    updateStatus,
    addComment
} = require('../controllers/issue.controller');
const {
    createIssueValidation,
    updateIssueValidation,
    addCommentValidation,
    objectIdValidation
} = require('../validators/validators');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   POST /api/issues
router.post('/', auth, createIssueValidation, createIssue);

// @route   GET /api/issues
router.get('/', auth, getAllIssues);

// @route   GET /api/issues/:id
router.get('/:id', auth, objectIdValidation, getIssueById);

// @route   PUT /api/issues/:id
router.put('/:id', auth, objectIdValidation, updateIssueValidation, updateIssue);

// @route   DELETE /api/issues/:id
router.delete('/:id', auth, roleCheck('Admin'), objectIdValidation, deleteIssue);

// @route   PUT /api/issues/:id/assign
router.put('/:id/assign', auth, roleCheck('Admin'), objectIdValidation, assignIssue);

// @route   PUT /api/issues/:id/status
router.put('/:id/status', auth, roleCheck('Technician', 'Admin'), objectIdValidation, updateStatus);

// @route   POST /api/issues/:id/comments
router.post('/:id/comments', auth, objectIdValidation, addCommentValidation, addComment);

module.exports = router;
