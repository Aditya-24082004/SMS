const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByRole
} = require('../controllers/user.controller');
const { objectIdValidation } = require('../validators/validators');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/users
router.get('/', auth, roleCheck('Admin'), getAllUsers);

// @route   GET /api/users/role/:role
router.get('/role/:role', auth, roleCheck('Admin'), getUsersByRole);

// @route   GET /api/users/:id
router.get('/:id', auth, objectIdValidation, getUserById);

// @route   PUT /api/users/:id
router.put('/:id', auth, roleCheck('Admin'), objectIdValidation, updateUser);

// @route   DELETE /api/users/:id
router.delete('/:id', auth, roleCheck('Admin'), objectIdValidation, deleteUser);

module.exports = router;
