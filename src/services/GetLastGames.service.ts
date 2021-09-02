import { ServiceCommand } from "../interfaces/Command";
import puppeteer from 'puppeteer'

export class GetLastGames implements ServiceCommand {
    async execute(): Promise<any> {
        await this.scrape().then((value) => {
            console.log(value)
        })
    }

    scrape = async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.flashscore.com.br/equipe/flamengo/WjxY29qB/resultados/')
        
    
        const data = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.event__score--home'), e => e.textContent)
        })

        browser.close()
        return data[2]
    }
}