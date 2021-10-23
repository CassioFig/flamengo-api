import { ServiceCommand } from "../interfaces";
import { GetLastGames } from "./GetLastGames.service";
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import { GetNextGames } from ".";
import { logger } from "../utils";

export class RunJobs implements ServiceCommand {
    async execute() {
        const getLastGames = new GetLastGames()
        const getNextGames = new GetNextGames()

        const rule = new RecurrenceRule()
        rule.hour = 0

        try {
            scheduleJob(rule, async () => {
                await getLastGames.execute()
                await getNextGames.execute()
            })   
            logger.info('Jobs scheduled for every day at midnight')
        } catch (error) {
            logger.error(`Error in "GetNextGames": ${error}`)
        }
    }
}