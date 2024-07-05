const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const {loginMiddleware, authMiddleware} = require('../middlewares/auth');

router.get('/register', loginMiddleware, auth.registerForm);
router.post('/register', auth.register);
router.get('/login', loginMiddleware, auth.loginForm);
router.post('/login', auth.login);
router.post('/logout', authMiddleware, auth.logout);

module.exports = router;