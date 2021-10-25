import { ServiceCommand } from "../interfaces";
import { Data } from "../schemas/Data";
import mongoose from 'mongoose'
import { logger } from "../utils";
import { RunJobs } from "./RunJobs";
require('dotenv').config()

export class SaveInDatabase implements ServiceCommand {
    
    async execute(data: any, service: string): Promise<void> {
        mongoose.connect(process.env.MONGO_URL)
                .then(() => { logger.info('MongoDB conectado com sucesso!')})
                .catch((error) => { logger.error(`Erro na conexão do MongoDB: ${error}`) })

        const exist = await Data.findOne({ service: service })
        if (exist) {
            await Data.updateOne(
                { service: service },
                {
                    lastUpdate: new Date().toLocaleDateString(),
                    data: data
                }
            )
        } else {
            await Data.insertMany({
                service: service,
                lastUpdate: new Date().toLocaleDateString(),
                data: data
            })
        }
    }
}

const runJobs = new RunJobs()
runJobs.execute()