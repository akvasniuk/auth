const {statusCode, constants: {AUTHORIZATION, REFRESH}} = require('../constants');
const {OAuth, User, UserLimit} = require('../database');
const {ErrorHandler, errorMessage} = require('../error');
const {passwordHelper, authHelper} = require('../helpers');
const {userService} = require('../services');
const {authValidator} = require('../validators');
const {constants} = require("../constants");
const requestIp = require("request-ip");

module.exports = {
    checkIsUserDataValid: async (req, res, next) => {
        try {
            const {error} = await authValidator.authLoginValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, error.details[0].message, errorMessage.NOT_VALID_DATA);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIsUserExist: async (req, res, next) => {
        try {
            const {email} = req.body;
            const user = await userService.findUserByEmail(email).select('+password');

            if (!user) {
                throw new ErrorHandler(statusCode.BAD_REQUEST, errorMessage.USER_NOT_EXISTS.message, errorMessage.USER_NOT_EXISTS.code);
            }

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIsUserActivated: (req, res, next) => {
        try {
            const {user: {isUserActivated}} = req;

            if (!isUserActivated) {
                throw new ErrorHandler(
                    statusCode.UNAUTHORIZED,
                    errorMessage.USER_NOT_ACTIVATED.message,
                    errorMessage.USER_NOT_ACTIVATED.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkIsPasswordValid: async (req, res, next) => {
        try {
            const {password} = req.body;

            await passwordHelper.compare(password, req.user.password);

            next();
        } catch (e) {
            next(e);
        }
    },

    checkAccessToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.NO_TOKEN.message, errorMessage.NO_TOKEN.code);
            }

            await authHelper.verifyToken(token);

            const tokenObject = await OAuth.findOne({accessToken: token});

            if (!tokenObject) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.WRONG_TOKEN.message, errorMessage.WRONG_TOKEN.code);
            }

            req.user = tokenObject.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkRefreshToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.NO_TOKEN.message, errorMessage.NO_TOKEN.code);
            }

            await authHelper.verifyToken(token, REFRESH);

            const tokenObject = await OAuth.findOne({refreshToken: token});

            if (!tokenObject) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.WRONG_TOKEN.message, errorMessage.WRONG_TOKEN.code);
            }

            req.user = tokenObject;
            next();
        } catch (e) {
            next(e);
        }
    },

    checkMailToken: async (req, res, next) => {
        try {
            const {emailToken} = req.params;

            if (!emailToken) {
                throw new ErrorHandler(statusCode.UNAUTHORIZED, errorMessage.NO_TOKEN.message, errorMessage.NO_TOKEN.code);
            }

            await authHelper.verifyEmailToken(emailToken);

            const tokenObject = await OAuth.findOne({emailToken});

            if (!tokenObject) {
                throw new ErrorHandler(
                    statusCode.UNAUTHORIZED,
                    errorMessage.WRONG_TOKEN.message,
                    errorMessage.WRONG_TOKEN.code);
            }

            req.user = tokenObject.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkRequestLimit: async (req, res, next) => {
        try {
            const userIp = requestIp.getClientIp(req);

            const userLimit = await UserLimit.findOne({userIp});
            const bannedUser = await UserLimit.findOne({userIp, isBanned: true});

            if (bannedUser) {
                const currentTime = new Date();
                if (currentTime < userLimit.period) {
                    throw new ErrorHandler(
                        statusCode.BAD_REQUEST,
                        errorMessage.REQUEST_LIMIT.message,
                        errorMessage.REQUEST_LIMIT.code
                    );
                } else {
                    userLimit.isBanned = false;
                    userLimit.period = 0;
                    await userLimit.save();
                }
            }

            if (!userLimit) {
                await UserLimit.create({userIp, requestCount: 1, lastRequestTime: new Date()
                    , endpoint: req.path});
            } else {
                const currentTime = new Date();
                const timeDiff = currentTime - userLimit.lastRequestTime;

                if (timeDiff <= constants.TIME_PERIOD) {
                    if (userLimit.requestCount >= constants.REQUEST_LIMIT) {
                        userLimit.isBanned = true;
                        const currentTime = new Date();
                        userLimit.period = currentTime.setMinutes(currentTime.getMinutes() + 2);
                        userLimit.save();

                        throw new ErrorHandler(
                            statusCode.BAD_REQUEST,
                            errorMessage.REQUEST_LIMIT.message,
                            errorMessage.REQUEST_LIMIT.code);
                    } else {
                        userLimit.requestCount += 1;
                    }
                } else {
                    userLimit.requestCount = 1;
                    userLimit.lastRequestTime = currentTime;
                }
                await userLimit.save();
            }

            next();
        } catch (e) {
            next(e)
        }
    }
    ,

    checkIsUserTokenValid: async (req, res, next) => {
        try {
            const {token, userId} = req.params;

            if (!token) {
                throw new ErrorHandler(
                    statusCode.BAD_REQUEST,
                    errorMessage.TOKEN_NOT_VALID.message,
                    errorMessage.TOKEN_NOT_VALID.code
                );
            }

            const user = await User.findById(userId);

            if (!user) {
                throw new ErrorHandler(
                    statusCode.BAD_REQUEST,
                    errorMessage.USER_NOT_EXISTS.message,
                    errorMessage.USER_NOT_EXISTS.code
                )
            }

            const tokenObject = await OAuth.findOne({authToken: token});
            if (!tokenObject) {
                throw new ErrorHandler(
                    statusCode.BAD_REQUEST,
                    errorMessage.TOKEN_NOT_VALID.message,
                    errorMessage.TOKEN_NOT_VALID.code
                );
            }

            console.log(tokenObject, user)

            if (!tokenObject.user._id.equals(user._id)) {
                throw new ErrorHandler(
                    statusCode.BAD_REQUEST,
                    errorMessage.USER_ID_NOT_VALID.message,
                    errorMessage.USER_ID_NOT_VALID.code
                );
            }

            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    }
};
