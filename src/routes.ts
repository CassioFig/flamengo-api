import { Router } from "express";
import { GetLastGamesController, GetNextGamesController, GetPlayersController } from "./controllers";

export const router = Router()

const getLastGamesController = new GetLastGamesController()
const getNextGames = new GetNextGamesController()
const getPlayers = new GetPlayersController

router.get("/api/lastGames", getLastGamesController.handle)
router.get("/api/nextGames", getNextGames.handle)
router.get("/api/players", getPlayers.handle)
