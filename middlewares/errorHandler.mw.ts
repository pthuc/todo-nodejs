import { ErrorRequestHandler } from "express"

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
    const statusCode = res.statusCode
    res.status(statusCode)
        .json({
            message: err.message
        })
}

export default errorHandler