import joi from "joi"

export const validator = joi.object({
    title: joi.string()
        .required(),
    description: joi.string(),
    assignee: joi.string()
        .required()
})
