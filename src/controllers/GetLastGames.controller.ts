import { Request, Response } from "express";
import { ControllerCommand } from "../interfaces/Command";
import { ReadJson } from "../utils/ReadJson";

export class GetLastGamesController implements ControllerCommand {
    async handle(request: Request, response: Response) {
        const readJson = new ReadJson()
        const lastGames = await readJson.execute("src/data/LastGames.json")
        
        return response.json(lastGames['games'])
    }
}