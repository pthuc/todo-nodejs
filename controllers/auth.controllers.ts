import { RequestHandler } from "express"
import Auth from "../models/auth.model"
import { validatorUp, validatorIn} from '../validators/auth.validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const PRIVATE_KEY = process.env.PRIVATE_KEY as string
const lifeTime = 1/2*60*60*1000

export const signUp: RequestHandler = async(req, res, next) => {
    try {
        // Get signup info
        const { username, email, password, level } = req.body

        // Validate
        await validatorUp.validateAsync({ username, email, password, level })

        // Check if user aldy exists
        const user = await Auth.findOne({ username })
        if (user) throw new Error('User already exists')

        // Create hashed password
        const hashedPw = await bcrypt.hash(password, 10)

        // Store user into db
        await Auth.create({
            username, email, password: hashedPw, level
        })

        // create token for user
        const token = jwt.sign(
            { username, email, level },
            PRIVATE_KEY,
            { expiresIn: lifeTime }
        )
        
        res.cookie('x-auth-token', token, { maxAge: lifeTime, httpOnly: true })

        // Client delivery
        res.status(200)
            .json('Successfully created user')

    } catch (error) {
        res.status(400)
        next(error)
    }
}


export const signIn: RequestHandler = async(req, res, next) => {
    try {
        // Get login info
        const { username, email, password } = req.body

        // Validate info
        await validatorIn.validateAsync({ username, email, password })

        // check username
        const user = await Auth.findOne({ username })
        if (!user) throw new Error('Incorrect username')
        const level = user.level

        // Check PW
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('Invalid password')

        // create token for user
        const token = jwt.sign(
            { username, email, level },
            PRIVATE_KEY,
            { expiresIn: lifeTime }
        )
        res.cookie('x-auth-token', token, { maxAge: lifeTime, httpOnly: true })

        // Client delivery
        res.status(200)
            .json('Successfully signed in!')

    } catch(error) {
        res.status(400)
        next(error)
    }
}
