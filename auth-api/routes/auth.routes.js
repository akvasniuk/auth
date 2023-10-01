const router = require('express').Router();

const {authController} = require('../controllers');
const {authMiddleware, userMiddleware} = require('../middlewars');

router.post('/login',
    authMiddleware.checkIsUserDataValid,
    authMiddleware.checkIsUserExist,
    authMiddleware.checkIsPasswordValid,
    authMiddleware.checkIsUserActivated,
    authController.generateToken,
    authController.login);

router.get('/login/:userId/:token',
    userMiddleware.isUserExists,
    authMiddleware.checkIsUserTokenValid,
    authController.login);

router.post('/logout', authMiddleware.checkAccessToken, authController.logout);

router.post('/refresh', authMiddleware.checkRefreshToken, authController.refresh);

router.get('/activate/mail/:emailToken', authMiddleware.checkMailToken, authController.activate);

module.exports = router;
