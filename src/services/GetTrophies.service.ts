import { ServiceCommand, Services, Trophies } from "../interfaces";
import { logger } from "../utils";
import puppeteer from 'puppeteer'
import { SaveInDatabase } from ".";

export class GetTrophies implements ServiceCommand {
    async execute(): Promise<void> {
        logger.info("Running function to list Flamengo trophies.")
        try {
            const saveInDatabase = new SaveInDatabase()

            logger.info('Starting scrap the page')
            const trophies = await this.scrape().then((value) => {
                return value
            })

            const data = { "trophies": trophies }

            logger.info('Saving data in MongoDB')
            await saveInDatabase.execute(data, Services.GET_TROPHIES)
        } catch (error) {
            logger.error(`Error in "GetTrophies": ${error}`)
        }
    }

    private scrape = async () => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()

        const url = "https://www.ogol.com.br/team_titles.php?id=2240"
        logger.info(`Accessing: ${url}`)
        await page.goto(url)

        const trophies_numbers = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("div.box#entity_list_titles>div.box#coach_list_titles>div.title>div.number"), e => Number(e.textContent))
        })

        const trophies_names = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("div.box#entity_list_titles>div.box#coach_list_titles>div.title>div.competition>div.micrologo_and_text>div.text"), e => e.textContent)
        })

        const trophies: Trophies[] = []
        for (let i = 0; i < trophies_names.length; i++) {
            let object: Trophies = {
                competition: trophies_names[i],
                number: trophies_numbers[i]
            }
            trophies.push(object)
        }
        return trophies
    }
}