// Import server module
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
// Import utils
import dotenv from 'dotenv'
import connectDb from './database/mongo.db'
import errorHandler from './middlewares/errorHandler.mw'
import authRouter from './routes/auth.routes'
import taskRouter from './routes/task.routes'



// Create Server Express App
const app = express()

// Load PORT
dotenv.config()
const PORT = process.env.PORT


const config = {
    origin: /.+/,//['http://localhost:3000'],
    credentials: true
}
// Apply middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(config))
app.use(cookieParser())
app.use(helmet())



// Routing
app.use('/auth', authRouter)
app.use('/api/tasks', taskRouter)


// Error Handling
app.use(errorHandler)

// Connect to DB and PORT
async function main() {
    try {
        await connectDb()
        app.listen(PORT)
        console.log(`Listening to port ${PORT}`)
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}
main()