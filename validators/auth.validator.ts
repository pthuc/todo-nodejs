import joi from 'joi'
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export const validatorUp = joi.object({
    username: joi.string()
        .min(5)
        .max(30)
        .required(),
    password: joi.string()
        .min(10)
        .required(),
    email: joi.string()
        .pattern(emailPattern),
    level: joi.string().
        required()
})

export const validatorIn = joi.object({
    username: joi.string()
        .min(5)
        .max(30),
    password: joi.string()
        .min(10)
        .required(),
    email: joi.string()
        .pattern(emailPattern)
}).xor('username', 'email')
