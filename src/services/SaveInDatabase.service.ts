import { ServiceCommand } from "../interfaces";
import { Data } from "../schemas/Data";
import mongoose from 'mongoose'
import { logger } from "../utils";
require('dotenv').config()

export class SaveInDatabase implements ServiceCommand {
    
    async execute(data: any, service: string): Promise<void> {
        mongoose.connect(process.env.MONGO_URL)
                .then()
                .catch((error) => { logger.error(`Erro na conexão do MongoDB: ${error}`) })

        const exist = await Data.findOne({ service: service })
        if (exist) {
            await Data.updateOne(
                { service: service },
                {
                    lastUpdate: new Date().toLocaleDateString('pt-BR'),
                    data: data
                }
            )
        } else {
            await Data.insertMany({
                service: service,
                lastUpdate: new Date().toLocaleDateString('pt-BR'),
                data: data
            })
        }
    }
}