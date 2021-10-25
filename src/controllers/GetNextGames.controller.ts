import { Request, Response } from "express";
import { ControllerCommand, Services } from "../interfaces";
import { Data } from "../schemas/Data";
import { logger } from "../utils";

export class GetNextGamesController implements ControllerCommand {
    async handle(request: Request, response: Response) {
        logger.info("Endpoint running to list the next games.")
        try {
            const lastGames = await Data.findOne({ service: Services.GET_NEXT_GAMES})
            response.json(lastGames.data['games'])
        } catch (error) {
            logger.error(`Error in "GetNextGamesController": ${error}`)
            response.status(500).send('Server error')
        }
    }
}