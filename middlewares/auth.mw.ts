import { RequestHandler } from "express"
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import Auth from "../models/auth.model"
import { Types } from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            username: string,
            email: string, 
            level: string, 
            id: Types.ObjectId
        }
    }
}

config()
const PRIVATE_KEY = process.env.PRIVATE_KEY as string

const authenticator: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies['x-auth-token']
        const { username, email, level} = jwt.verify(token, PRIVATE_KEY) as { username: string, email: string, level: string}
        const user = await Auth.findOne({ username })
        if (!user) throw new Error('User does not exists')

        req.id = user._id
        req.username = username
        req.email = email
        req.level = level
        
        next()
    } catch (error) {
        res.status(400)
        next(error)
    }
}


export default authenticator