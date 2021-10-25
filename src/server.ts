import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import swaggerUi from 'swagger-ui-express'
import { router } from "./routes"
import { RunJobs } from "./services/RunJobs"
import { logger } from './utils'
import swaggerDocs from './swagger.json'

const runJobs = new RunJobs()
const app = express()

app.use(cors())

app.use(express.json())

// app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(router)

logger.info('Running Jobs')
runJobs.execute()

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return response.status(400).json({
            error: err.message
        })
    }

    return response.status(500).json({
        status: "error",
        message: "Internal Server Error",
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => logger.info(`Server is running on port ${port}`))