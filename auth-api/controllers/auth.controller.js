const {statusCode, successfulMessage} = require('../constants');
const {OAuth} = require('../database');
const {authHelper} = require('../helpers');
const {userHelper} = require('../helpers');
const {mailService, userService, authService} = require('../services');
const {
    emailActionsEnum: {WELCOME, SEND_TOKEN},
    emailActionImage: {REGISTER_IMAGE}
} = require('../constants');

module.exports = {
    login: async (req, res, next) => {
        try {
            const {user_id} = req.params;

            const authResponse = await authService.generateAuthResponse(user_id ?? req.user._id, req.user);
            res.json(authResponse);
        } catch (e) {
            next(e);
        }
    },

    generateToken: async (req, res, next) => {
        try {
            const {_id} = req.user;

            const normalizedUser = userHelper.userNormalizator(req.user.toJSON());

            if (!normalizedUser.isEnable2FA) {
                next();
            }

            const token = authHelper.generateToken();

            await OAuth.updateOne({user: _id}, {authToken: token});

            await mailService.sendMail(
                normalizedUser.email,
                SEND_TOKEN,
                {userName: normalizedUser.name, token});

            res.json(_id);
        } catch (e) {
            next(e);
        }
    },

    logout: async (req, res, next) => {
        try {
            const {accessToken} = req.user;

            await OAuth.remove({accessToken});

            res.status(statusCode.DELETED).json(successfulMessage.SUCCESSFUL_LOGOUT);
        } catch (e) {
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const {user: {_id}, refreshToken, user} = req.user;

            const tokenPair = authHelper.generateTokenPair();

            await OAuth.remove({refreshToken});
            await OAuth.create({...tokenPair, user: _id});

            res.status(statusCode.UPDATED).json({...tokenPair, user});
        } catch (e) {
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            const {email, name, _id} = req.user;

            await userService.updateUser({_id}, {isUserActivated: true});
            await mailService.sendMail(email, WELCOME, {userName: name, img: REGISTER_IMAGE});

            res.status(statusCode.UPDATED).json(successfulMessage.ACCOUNT_SUCCESSFUL_ACTIVATED);
        } catch (e) {
            next(e);
        }
    },

    changePassword: (req, res, next) => {
        try {
            const {tokenObject: {passwordToken}} = req;

            res.status(statusCode.UPDATED).json({changeTokenPassword: passwordToken});
        } catch (e) {
            next(e);
        }
    }
};
