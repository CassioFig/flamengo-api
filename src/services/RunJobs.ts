import { ServiceCommand } from "../interfaces";
import { GetNextGames, GetPlayers, GetLastGames, GetTrophies } from ".";
import { logger } from "../utils";

export class RunJobs implements ServiceCommand {
    async execute() {
        const getLastGames = new GetLastGames()
        const getNextGames = new GetNextGames()
        const getPlayers = new GetPlayers()
        const getTrophies = new GetTrophies()

        logger.info('Running Jobs')
        try {
            await getTrophies.execute()
            await getLastGames.execute()
            await getNextGames.execute()
            await getPlayers.execute()
            logger.info('Run Jobs finished')
        } catch (error) {
            logger.error(`Error in "GetNextGames": ${error}`)
        }
    }
}

const runJobs = new RunJobs()
runJobs.execute()