import mongoose from "mongoose"
import { config } from 'dotenv'

config()
const URI = process.env.MONGO_URI as string

export default async function connectDb() {
    try {
        const conn = await mongoose.connect(URI)
        console.log(`Listening to db @${conn.connection.host}`)
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}