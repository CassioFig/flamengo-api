import { Request, Response } from "express";
import { ControllerCommand, Services } from "../interfaces";
import { Data } from "../schemas/Data";
import { logger } from "../utils";

export class GetLastGamesController implements ControllerCommand {
    async handle(request: Request, response: Response) {
        logger.info("Endpoint running to list the last games.")
        try {
            const lastGames = await Data.findOne({ service: Services.GET_LAST_GAMES })
            return response.json(lastGames.data['games'])
        } catch(error) {
            logger.error(`Error in "GetLastGamesController": ${error}`)
            return response.status(500).send('Server error')
        }
    }
}