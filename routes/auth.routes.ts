import { Router } from 'express'
import { signIn, signUp, signOut, validate } from '../controllers/auth.controllers'
import authenticator from '../middlewares/auth.mw'

const router = Router()


router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout', signOut)
router.post('/validate', authenticator, validate)


export default router
