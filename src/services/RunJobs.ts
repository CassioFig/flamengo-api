import { ServiceCommand } from "../interfaces";
import { GetNextGames, GetPlayers, GetLastGames } from ".";
import { logger } from "../utils";

export class RunJobs implements ServiceCommand {
    async execute() {
        const getLastGames = new GetLastGames()
        const getNextGames = new GetNextGames()
        const players = new GetPlayers()

        logger.info('Running Jobs')
        try {
            await getLastGames.execute()
            await getNextGames.execute()
            await players.execute()
        } catch (error) {
            logger.error(`Error in "GetNextGames": ${error}`)
        }
        logger.info('Run Jobs finished')
    }
}

const runJobs = new RunJobs()
runJobs.execute()