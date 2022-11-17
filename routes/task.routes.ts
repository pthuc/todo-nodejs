import { Router } from 'express'
import { addTask, commentOnTask, getTasks, reactComment, removeTask } from '../controllers/task.controllers'
import authenticator from '../middlewares/auth.mw'

const router = Router()

router.use(authenticator)

router.route('/')
    .get(getTasks)
    .post(addTask)

router.route('/:taskId')
    .delete(removeTask)
    .post(commentOnTask)


router.route('/:taskId/:commentId')
    .post(reactComment)


export default router