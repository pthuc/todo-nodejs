import { Schema, model } from "mongoose"


const schema = new Schema({
    username: {
        type: String,
        min: 5,
        max: 30,
        required: true
    },
    password: {
        type: String,
        min: 10,
        required: true
    },
    email: {
        type: String,
        min: 10,
        max: 55,
        required: true
    },
    level: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'account'
})

export default model('Auth', schema)