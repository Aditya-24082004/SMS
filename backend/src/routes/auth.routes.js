const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../validators/validators');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
router.post('/login', loginValidation, login);

// @route   POST /api/auth/refresh-token
router.post('/refresh-token', refreshToken);

// @route   POST /api/auth/logout
router.post('/logout', auth, logout);

module.exports = router;
