import puppeteer from 'puppeteer'
import { SaveInDatabase } from '.';
import { LastGames, ServiceCommand, Services } from "../interfaces";
import { logger } from "../utils";

export class GetLastGames implements ServiceCommand {
    async execute(): Promise<void> {
        logger.info("Running function to list the last games.")
        try {
            const saveInDatabse = new SaveInDatabase()

            logger.info('Starting scrap the page')
            const lastGames = await this.scrape().then((value) => {
                return value
            })
            
            const data = { "games": lastGames }

            logger.info('Saving data in MongoDB')
            await saveInDatabse.execute(data, Services.GET_LAST_GAMES)
        } catch (error) {
            logger.error(`Error in "GetLastGames": ${error}`)
        }
    }

    private scrape = async () => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()
        
        const url = 'https://www.ogol.com.br/team_results.php?id=2240&epoca_id=150'
        logger.info(`Accessing: ${url}`)
        await page.goto(url)

        const dates = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('tr.parent>td.double'), 
            e => e.textContent)
        })

        const competitions = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('tr.parent>td.text'), e => e.textContent)
            return array.filter((value, index) => {
                if (index % 2 !== 0) {
                    return value
                }
            })
        })

        const teams = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('tr.parent>td.text'), e => e.textContent)
            return array.filter((value, index) => {
                if (index % 2 === 0) {
                    return value
                }
            })
        })

        const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('tr.parent>td.result'), e => e.textContent)
        })

        const fields = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('tr.parent>td'), e => e.textContent)
            return array.filter((value, index) => {
                if (value.includes("(")) {
                    return value
                } else if (value === '' && array[index + 4] === 'F') {
                    return " "
                }
            })
        })
        

        const lastGames: LastGames[] = [];
        for (let index = 0; index < 10; index++) {
            let score = results[index].split('-')

            let home: string
            let away: string
            if (fields[index] === '(F)') {
                home = teams[index]
                away = 'Flamengo'
            } else if (fields[index] === '(C)' || fields[index] === "") {
                away = teams[index]
                home = 'Flamengo'
            }

            const date = new Date(dates[index])
            date.setDate(date.getDate() + 1)

            let game: LastGames = {
                competition: competitions[index],
                date: date.toLocaleDateString(),
                home: home,
                score_home: parseInt(score[0]),
                score_away: parseInt(score[1]),
                away: away
            }
            lastGames.push(game)
        }
        return lastGames
    }
}