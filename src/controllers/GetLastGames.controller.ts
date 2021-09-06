import { Request, Response } from "express";
import { ControllerCommand } from "../interfaces/Command";
import { GetLastGames } from "../services/GetLastGames.service";

export class GetLastGamesController implements ControllerCommand {
    async handle(request: Request, response: Response) {
        const getLastGames = new GetLastGames()
        const lastGames = await getLastGames.execute()
        
        return response.json(lastGames)
    }
}