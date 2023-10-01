const router = require('express').Router();

const {userController} = require('../controllers');
const {
    userMiddleware,
    authMiddleware
} = require('../middlewars');

router.get('/', userController.allUser);

router.post('/',
    userMiddleware.isUserDataValid,
    userMiddleware.isUserRegister,
    userController.createUser);

router.get("/verifyCaptcha/:captchaToken",
    userController.verifyCaptcha
);

router.use('/:userId', userMiddleware.isUserExists);

router.patch("/:userId", authMiddleware.checkAccessToken, userController.updateUser )

router.get('/:userId', userController.getUser);

router.delete('/:userId', authMiddleware.checkAccessToken, userController.deleteUser);

module.exports = router;
