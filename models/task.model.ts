import { Schema, model } from 'mongoose'

export const reactionTypes = ['like', 'dislike', 'love', 'care', 'laugh']

const reaction = reactionTypes.reduce((obj: any, type: string) => {
    obj[type] = [String]
    return obj
}, {})

const commentSchema = new Schema(
    {
        commenter: {
            type: String,
            required: true
        },
        comment: String,
        reaction
    },
    {
        timestamps: true
    }
)

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    completed: {
        type: Boolean,
        required: true
    },
    assigner: {
        type: String,
        required: true
    },
    assignee: {
        type: String,
        required: true
    },
    comments: {
        type: [
            commentSchema
        ]
    }
}, {
    timestamps: true,
    collection: 'tasks'
})

export default model('Task', taskSchema)