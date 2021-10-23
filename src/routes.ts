import { Router } from "express";
import { GetLastGamesController, GetNextGamesController } from "./controllers";

export const router = Router()

const getLastGamesController = new GetLastGamesController()
const getNextGames = new GetNextGamesController()

router.get("/api/lastGames", getLastGamesController.handle)
router.get("/api/nextGames", getNextGames.handle)
