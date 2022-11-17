import { RequestHandler } from "express"
import Task from "../models/task.model"
import User from "../models/auth.model"
import { validator as taskValidator } from "../validators/task.validator"


export const getTasks: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.id
        
        const assignedTasks = await Task.find({ assignee: userId })
        const assigningTasks = await Task.find({ assigner: userId })
        
        res.status(200)
            .json({
            assignedTasks,
            assigningTasks
        })
    } catch (error) {
        res.status(400)
        next(error)
    }
}


export const addTask: RequestHandler = async (req, res, next) => {
    try {
        const { title, description, assignee } = req.body
        await taskValidator.validateAsync({ title, description, assignee })

        const assignerId = req.id

        const assigneeCheck = await User.findOne({ username: assignee })
        if (!assigneeCheck) throw new Error('Invalid assignee username')
        const assigneeId = assigneeCheck._id

        await Task.create({ title, description, assignee: assigneeId, assigner: assignerId, completed: false})

        res.status(200)
            .json('Successfully added a new task')
    } catch (error) {
        res.status(400)
        next(error)
    }
}

export const removeTask: RequestHandler = async (req, res, next) => {
    try {
        const { taskId } = req.params
        const userId = req.id

        const task = await Task.findOneAndDelete({ _id: taskId, assigner: userId })
        if (!task) throw new Error('You do not have permission to remove task, or the task does not exists')

        res.status(200)
            .json('Successfully deleted the task')
    } catch (error) {
        res.status(400)
        next(error)
    }
}

export const likeTask: RequestHandler =async (req, res, next) => {
    try {
        const { taskId, commentId } = req.params
        const userId = req.id

        const task = await Task.findById(taskId)
        if (!task) throw new Error('Task does not exist')
        
        let commentLikes = task.comments.id(commentId)?.likes
        const wasLiked = commentLikes?.indexOf(userId) as number
        
        if (wasLiked == -1) {
            task.comments.id(commentId)?.likes.push(userId)
        } else {
            task.comments.id(commentId)?.likes.splice(wasLiked, 1)
        }
    
        await task.save()

        res.status(200)
            .json(wasLiked == -1 ? 'Liked!' : 'Unliked')


    } catch (error) {
        res.status(400)
        next(error)
    }
}

export const commentOnTask: RequestHandler = async (req, res, next) => {
    try {
        const { taskId } = req.params
        const user = req.id
        const { comment } = req.body

        const task = await Task.findByIdAndUpdate({
            _id: taskId
        }, {
            $push: {
                comments: {
                    user,
                    comment
                }
            }
        })

        if (!task) throw new Error('Task does not exist')

            res.status(200)
                .json('Commented!')
    } catch (error) {
        res.status(200)
        next(error)
    }
}