import { ServiceCommand, Services } from "../interfaces";
import puppeteer from 'puppeteer'
import { Players } from "../interfaces/Players";
import { logger } from "../utils";
import { SaveInDatabase } from ".";

export class GetPlayers implements ServiceCommand {
    async execute(): Promise<void> {
        logger.info("Running function to list players.")
        try {
            const saveInDatabse = new SaveInDatabase()

            logger.info('Starting scrap the page')
            const players = await this.scrape().then((value) => {
                return value
            })

            const data = {
                "players": {
                    "goalkeepers": players.goalkeepers,
                    "defenders": players.defenders,
                    "left_backs": players.left_backs,
                    "right_backs": players.right_backs,
                    "defensive_midfielders": players.defensive_midfielders,
                    "midfielders": players.midfielders,
                    "strikers": players.strikers
                }
            }

            logger.info('Saving data in MongoDB')
            await saveInDatabse.execute(data, Services.GET_PLAYERS)
        } catch (error) {
            logger.error(`Error in "GetPlayers": ${error}`)
        }
    }

    private scrape = async () => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()

        const url = "https://www.flamengo.com.br/elencos/elenco-profissional"
        logger.info(`Accessing: ${url}`)
        await page.goto(url)

        const players = await page.evaluate(() => {
            const array: any = Array.from(document.querySelectorAll("div.container.py-5>div.row"), e => e.textContent)
            const regex = new RegExp("[a-záàâãéèêíïóôõöúçñ]+\\s?[a-záàâãéèêíïóôõöúçñ]+\\s?[a-záàâãéèêíïóôõöúçñ]+", 'ig')

            for (let i = 0; i < array.length; i++) {
                array[i] = array[i].match(regex)
            }
            
            for (let i = 0; i < array.length; i++) {
                const read = []
                const players = array[i]
                for (let j = 1; j < players.length; j++) {
                    if (!read.includes(players[j])) {
                        read.push(players[j])
                    }
                }
                array[i] = read
            }

            return array
        })

        const team: Players = {
            goalkeepers: players[0],
            defenders: players[1],
            left_backs: players[2],
            right_backs: players[3],
            defensive_midfielders: players[4],
            midfielders: players[5],
            strikers: players[6]
        }

        return team
    }
}