import { Request, Response } from "express";
import { ControllerCommand, Services } from "../interfaces";
import { logger } from "../utils";
import { Data } from '../schemas/Data'

export class GetPlayersController implements ControllerCommand {
    async handle(request: Request, response: Response): Promise<void> {
        logger.info("Endpoint running to list players.")
        try {
            const players = await Data.findOne({ service: Services.GET_PLAYERS })

            if (players === null) {
                response.status(200).json({})
            } else {
                response.json(players.data['players'])
            }
        } catch (error) {
            logger.error(`Error in "GetPlayersController": ${error}`)
            response.status(500).send('Server error')
        }
    }
}