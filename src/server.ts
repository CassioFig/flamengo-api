import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import swaggerUI from 'swagger-ui-express'
import { router } from "./routes"
import { logger } from './utils'
import swaggerDocs from './swagger.json'
import mongoose from 'mongoose'
import { RunJobs } from "./services/RunJobs"
require('dotenv').config()

const app = express()

app.use(cors())

app.use(express.json())

app.use(router)
app.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

mongoose.connect(process.env.MONGO_URL)
        .then(() => { logger.info('MongoDB conectado com sucesso!')})
        .catch((error) => { logger.error(`Erro na conexão do MongoDB: ${error}`) })

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