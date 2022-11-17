import { Schema, model } from 'mongoose'

const commentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true
        },
        comment: {
            type: String
        },
        likes: [
            Schema.Types.ObjectId
        ]
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
        type: Schema.Types.ObjectId,
        required: true
    },
    assignee: {
        type: Schema.Types.ObjectId,
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