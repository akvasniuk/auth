const fs = require('fs');
const {promisify} = require('util');

const {
    statusCode,
    successfulMessage,
    constants: {AUTHORIZATION},
    emailActionsEnum: {
        UPDATE_USER,
        DELETE_USER,
        VERIFY_ACCOUNT,
        CHANGE_PASSWORD
    },
    emailActionImage: {
        UPDATE_IMAGE,
        DELETE_IMAGE
    }, constants
} = require('../constants');
const {userService, mailService} = require('../services');
const {passwordHelper, userHelper, authHelper} = require('../helpers');
const {OAuth} = require('../database');
const {fileHelper} = require('../helpers');
const {ErrorHandler, errorMessage} = require('../error');
const axios = require("axios");

const rmdirPromisify = promisify(fs.rmdir);
const unlinkPromisify = promisify(fs.unlink);

module.exports = {
    allUser: async (req, res, next) => {
        try {
            const users = await userService.getAllUsers().lean();
            const normalizedUsers = [];

            for (const user of users) {
                const normalizedUser = userHelper.userNormalizator(user);

                normalizedUsers.push(normalizedUser);
            }

            res.json(normalizedUsers);
        } catch (e) {
            next(e);
        }
    },

    verifyCaptcha: async (req, res, next) => {
        try {
            const {captchaToken} = req.params;

            const response = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify
                ?secret=${constants.SECRET_KEY}&response=${captchaToken}`
            );

            if (response.data.success) {
                res.send("Human 👨 👩");
            } else {
                res.send("Robot 🤖");
            }
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const {user, user: {_id}} = req;
            const token = req.get(AUTHORIZATION);

            const deletedUser = userService.deleteUser(user);

            await userService.updateUser({_id}, deletedUser);
            await OAuth.deleteOne({accessToken: token});
            await mailService.sendMail(user.email, DELETE_USER, {userName: user.name, img: DELETE_IMAGE});

            res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    getUser: (req, res, next) => {
        try {
            const {user} = req;

            res.json(user);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const {
                body: {email, name, password}
            } = req;

            const hashedPassword = await passwordHelper.hash(password);

            const {emailToken} = authHelper.generateEmailToken();

            const createdUser = await userService.insertUser({...req.body, password: hashedPassword});

            const {_id} = createdUser;

            await OAuth.create({emailToken, user: _id});
            await mailService.sendMail(email, VERIFY_ACCOUNT, {userName: name, emailToken});

            res.status(statusCode.CREATED).json(successfulMessage.REGISTER_MESSAGE);
        } catch (e) {
            console.log(e)

            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {user} = req;

            await userService.updateUser(user, req.body);
            await mailService.sendMail(user.email, UPDATE_USER, {userName: user.name, img: UPDATE_IMAGE});

            res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },
}
