import { Request, Response } from "express";
import { ControllerCommand } from "../interfaces";
import { logger, ReadJson } from "../utils";

export class GetPlayersController implements ControllerCommand {
    async handle(request: Request, response: Response): Promise<void> {
        logger.info("Endpoint running to list players.")
        try {
            const readJson = new ReadJson()
            const players = await readJson.execute("src/data/Players.json")
            response.json(players['players'])
        } catch (error) {
            logger.error(`Error in "GetPlayersController": ${error}`)
            response.status(500).send('Server error')
        }
    }
}