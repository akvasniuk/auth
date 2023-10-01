const Joi = require('joi');

export default Joi.object({
    email: Joi
        .string()
        .trim()
        .email({tlds:{allow: false}})
        .required(),
    password: Joi
        .string()
        .trim()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, ' +
                'one lowercase letter, one digit, one special character, a' +
                'nd be at least 8 characters long.',
            'any.required': 'Password is required.',
        })
});
