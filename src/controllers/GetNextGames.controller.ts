import { Request, Response } from "express";
import { ControllerCommand } from "../interfaces";
import { logger, ReadJson } from "../utils";

export class GetNextGamesController implements ControllerCommand {
    async handle(request: Request, response: Response) {
        logger.info("Endpoint running to list the next games.")
        try {
            const readJson = new ReadJson()
            const lastGames = await readJson.execute("src/data/NextGames.json")
            response.json(lastGames['games'])
        } catch (error) {
            logger.error(`Error in "GetNextGamesController": ${error}`)
            response.status(500).send('Server error')
        }
    }
}