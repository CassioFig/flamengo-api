import { ServiceCommand } from "../interfaces";
import { GetLastGames } from "./GetLastGames.service";
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import { GetNextGames } from ".";

export class RunJobs implements ServiceCommand {
    async execute() {
        const rule = new RecurrenceRule()
        rule.hour = 21
        rule.minute = 34
        // rule.date = 22
        // rule.month = 10
        // rule.year = 2021
        rule.second = 50
       
        const getLastGames = new GetLastGames()
        const getNextGames = new GetNextGames()

        scheduleJob(rule, async () => {
            await getLastGames.execute()
            await getNextGames.execute()
        })     
    }
}