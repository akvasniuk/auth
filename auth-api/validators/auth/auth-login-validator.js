const Joi = require('joi');
const {Regexp} = require('../../constants');

module.exports = Joi.object({
    email: Joi
        .string()
        .trim()
        .email()
        .required(),
    password: Joi
        .string()
        .trim()
        .regex(Regexp.PASSWORD)
        .required()
});
