import { Router } from "express";
import { GetLastGamesController } from "./controllers/GetLastGames.controller";

export const router = Router()

const getLastGamesController = new GetLastGamesController()

router.get("/api/lastGames", getLastGamesController.handle)
