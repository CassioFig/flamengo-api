import { Request, Response } from "express";
import { ControllerCommand } from "../interfaces";
import { logger, ReadJson } from "../utils";

export class GetLastGamesController implements ControllerCommand {
    async handle(request: Request, response: Response) {
        logger.info("Endpoint running to list the last games.")
        try {
            const readJson = new ReadJson()
            const lastGames = await readJson.execute("src/data/LastGames.json")
            return response.json(lastGames['games'])
        } catch(error) {
            logger.error(`Error in "GetLastGamesController": ${error}`)
            return response.status(500).send('Server error')
        }
    }
}