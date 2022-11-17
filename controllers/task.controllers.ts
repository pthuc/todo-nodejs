import { RequestHandler } from "express"
import Task from "../models/task.model"
import User from "../models/auth.model"
import { validator as taskValidator } from "../validators/task.validator"
import { reactionTypes } from "../models/task.model"

// Get All Tasks from database //////////////////////////////////////////////////////////////////////////////////////////////
export const getTasks: RequestHandler = async (req, res, next) => {
    try {
        const user = req.username
        
        const assignedTasks = await Task.find({ assignee: user })
        const assigningTasks = await Task.find({ assigner: user })
        
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

// Set A New Task into database //////////////////////////////////////////////////////////////////////////////////////////////
export const addTask: RequestHandler = async (req, res, next) => {
    try {
        const { title, description, assignee } = req.body
        await taskValidator.validateAsync({ title, description, assignee })

        const assigner = req.username

        const assigneeCheck = await User.findOne({ username: assignee })
        if (!assigneeCheck) throw new Error('Invalid assignee username')

        await Task.create({ title, description, assignee, assigner , completed: false})

        res.status(200)
            .json('Successfully added a new task')
    } catch (error) {
        res.status(400)
        next(error)
    }
}

// remove A Task from database //////////////////////////////////////////////////////////////////////////////////////////////
export const removeTask: RequestHandler = async (req, res, next) => {
    try {
        const { taskId } = req.params
        const assigner = req.username

        const task = await Task.findOneAndDelete({ _id: taskId, assigner })
        if (!task) throw new Error('You do not have permission to remove task, or the task does not exists')

        res.status(200)
            .json('Successfully deleted the task')
    } catch (error) {
        res.status(400)
        next(error)
    }
}

// Comment to A Task from database //////////////////////////////////////////////////////////////////////////////////////////////
export const commentOnTask: RequestHandler = async (req, res, next) => {
    try {
        const commenter = req.username
        const { taskId } = req.params
        const { comment } = req.body

        const task = await Task.findByIdAndUpdate(taskId, {
            $push: {
                comments: {
                    commenter,
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

// React to A Comment form A Task //////////////////////////////////////////////////////////////////////////////////////////////
export const reactComment: RequestHandler =async (req, res, next) => {
    try {
        const { taskId, commentId, reactType } = req.params
        const reactor = req.username

        const task = await Task.findById(taskId)
        if (!task) throw new Error('Task does not exist')
        
        let response

        const setReaction = (reactType: string, type: string) => {
            const isReacted = task.comments.id(commentId)?.reaction[type].indexOf(reactor)
            if (reactType === type) {
                if (isReacted != -1) {
                    task.comments.id(commentId)?.reaction[type].splice(isReacted, 1)
                    response = `un${reactType}ed!`
                } else {
                    task.comments.id(commentId)?.reaction[type].push(reactor)
                    response = `${reactType}ed!`
                }
            } else {
                if (isReacted != -1) {
                    task.comments.id(commentId)?.reaction[type].splice(isReacted, 1)
                }
            }
        }

        reactionTypes.forEach(type => {
            setReaction(reactType, type)
        })
            
        await task.save()

        res.status(200)
            .json(response)


    } catch (error) {
        res.status(400)
        next(error)
    }
}

