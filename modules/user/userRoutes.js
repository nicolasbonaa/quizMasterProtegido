const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { registerValidator, loginValidator, profileUpdateValidator, createUserValidator, updateUserValidator } = require('./userValidator');
const { isAuthenticated, requireAdmin, isOwnerOrAdmin } = require('../../middlewares/auth');
const profileMulter = require('../../middlewares/profileMulter');
const asyncHandler = require('../../middlewares/asyncHandler');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Muitas tentativas de autenticação. Tente novamente mais tarde.', errors: [] }
});

router.get('/users', isAuthenticated, requireAdmin, asyncHandler(userController.listUsers));
router.get('/users/:id', isAuthenticated, isOwnerOrAdmin, asyncHandler(userController.getUserById));
router.post('/users', isAuthenticated, requireAdmin, createUserValidator, asyncHandler(userController.createUser));
router.put('/users/:id', isAuthenticated, isOwnerOrAdmin, updateUserValidator, asyncHandler(userController.updateUser));
router.delete('/users/:id', isAuthenticated, isOwnerOrAdmin, asyncHandler(userController.deleteUser));

router.post('/register', registerValidator, asyncHandler(userController.register));

router.post('/login', authLimiter, loginValidator, asyncHandler(userController.login));

router.post('/logout', userController.logout);

router.get('/profile/me', isAuthenticated, asyncHandler(userController.getMyProfile));

router.put('/profile/me', isAuthenticated, profileMulter.single('profilePicture'), 
    profileUpdateValidator, asyncHandler(userController.updateProfile));

router.get('/profile/:username', asyncHandler(userController.getPublicProfile));

module.exports = router;