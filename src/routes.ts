import { Router } from "express";
import { GetLastGamesController, GetNextGamesController, GetPlayersController, GetTrophiesController } from "./controllers";

export const router = Router()

const getLastGamesController = new GetLastGamesController()
const getNextGames = new GetNextGamesController()
const getPlayers = new GetPlayersController()
const getTrophies = new GetTrophiesController()

router.get("/api/lastGames", getLastGamesController.handle)
router.get("/api/nextGames", getNextGames.handle)
router.get("/api/players", getPlayers.handle)
router.get("/api/trophies", getTrophies.handle)
