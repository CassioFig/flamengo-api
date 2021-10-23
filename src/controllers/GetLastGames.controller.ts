import { Request, Response } from "express";
import { ControllerCommand } from "../interfaces";
import { ReadJson } from "../utils";

export class GetLastGamesController implements ControllerCommand {
    async handle(request: Request, response: Response) {
        const readJson = new ReadJson()
        const lastGames = await readJson.execute("src/data/LastGames.json")
        
        return response.json(lastGames['games'])
    }
}