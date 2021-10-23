import { ServiceCommand } from "../interfaces/Command";
import { GetLastGames } from "./GetLastGames.service";
import { RecurrenceRule, scheduleJob } from 'node-schedule'

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

        scheduleJob(rule, async () => {
            await getLastGames.execute()
        })     
    }
}