import { Request, Response } from "express";
import { ControllerCommand } from "../interfaces";
import { GetNextGames } from "../services";
import { ReadJson } from "../utils";

export class GetNextGamesController implements ControllerCommand {
    async handle(request: Request, response: Response) {
        const readJson = new ReadJson()
        const lastGames = await readJson.execute("src/data/NextGames.json")

        response.json(lastGames)
    }
}