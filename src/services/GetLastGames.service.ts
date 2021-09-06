import { ServiceCommand } from "../interfaces/Command";
import puppeteer from 'puppeteer'
import { LastGames } from "../interfaces/LastGames";

export class GetLastGames implements ServiceCommand {
    async execute(): Promise<LastGames[]> {
        return await this.scrape().then((value) => {
            return value
        })
    }

    scrape = async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.flashscore.com.br/equipe/flamengo/WjxY29qB/resultados/')
        
        const competitions = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.event__title--name'), e => e.textContent)
        })

        const teams_home = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.event__participant--home'), e => e.textContent)
        })

        const scores_home = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.event__score--home'), e => e.textContent)
        })

        const scores_away = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.event__score--away'), e => e.textContent)
        })

        const teams_away = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.event__participant--away'), e => e.textContent)
        })
        
        const lastGames: LastGames[] = [];

        for (let index = 0; index < 10; index++) {
            let game: LastGames = {
                competition: competitions[index],
                home: teams_home[index],
                score_home: parseInt(scores_home[index]),
                score_away: parseInt(scores_away[index]),
                away: teams_away[index]
            }
            lastGames.push(game)
        }
        
        return lastGames
    }
}