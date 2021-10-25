import { NextGames, ServiceCommand, Services } from "../interfaces";
import { logger } from "../utils";
import puppeteer from 'puppeteer'
import { SaveInDatabase } from ".";


export class GetNextGames implements ServiceCommand {
    async execute(): Promise<void> {
        logger.info("Running function to list the next games.")
        try {
            const saveInDatabse = new SaveInDatabase()

            logger.info('Starting scrap the page')
            const nextGames = await this.scrape().then((value) => {
                return value
            })

            const data = { "games": nextGames }
            
            logger.info('Saving data in MongoDB')
            await saveInDatabse.execute(data, Services.GET_NEXT_GAMES)
        } catch (error) {
            logger.error(`Error in "GetNextGames": ${error}`)
        }
        
    }

    private scrape = async () => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()

        const url = 'https://www.ogol.com.br/team_fixtures.php?id=2240&epoca_id=150'
        logger.info(`Accessing: ${url}`)
        await page.goto(url)

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

        const dates = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('tr.parent>td.double'), e => e.textContent)
            return array.filter((value, index) => {
                if (index % 2 === 0) {
                    return value
                }
            })
        })

        const times = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('tr.parent>td'), e => e.textContent)
            return array.filter((value) => {
                if (value.includes(':')) {
                    return value
                }
            })
        })

        const field = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('tr.parent>td'), e => e.textContent)
            return array.filter((value, index) => {
                if (value.includes("(")) {
                    return value
                } else if (value === '' && array[index + 4] === 'F') {
                    return " "
                }
            })
        })

        const result = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('tr.parent>td.result'), e => e.textContent)
        })
        
        const nextGames: NextGames[] = []
        let count = 0
        for (let index = 0; count < 18; index++) {

            let home: string
            let away: string         
            if (field[index] === '(F)') {
                home = teams[index]
                away = 'Flamengo'
            } else if (field[index] === '(C)' || field[index] === "") {
                away = teams[index]
                home = 'Flamengo'
            }

            if (result[index] !== 'ADI') {
                let game: NextGames = {
                    competition: competitions[index],
                    home: home,
                    away: away,
                    date: dates[index],
                    time: times[index]
                }

                if (!competitions[index]) { break }
                nextGames.push(game)
                count++
            }
        }
        return nextGames
    }
}