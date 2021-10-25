import { Request, Response } from "express";
import { ControllerCommand, Services } from "../interfaces";
import { Data } from "../schemas/Data";
import { logger } from "../utils";

export class GetTrophiesController implements ControllerCommand {
    async handle(request: Request, response: Response) {
        logger.info("Endpoint running to list the next games.")
        try {
            const lastGames = await Data.findOne({ service: Services.GET_TROPHIES})

            if (lastGames === null) {
                response.status(200).json([])
            } else {
                response.json(lastGames.data['trophies'])
            }
        } catch (error) {
            logger.error(`Error in "GetTrophiesController": ${error}`)
            response.status(500).send('Server error')
        }
    }
}