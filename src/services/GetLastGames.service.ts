import puppeteer from 'puppeteer'
import { LastGames, ServiceCommand } from "../interfaces";
import { WriteJson } from "../utils";

export class GetLastGames implements ServiceCommand {
    async execute(): Promise<void> {
        const writeJson = new WriteJson()

        const lastGames = await this.scrape().then((value) => {
            return value
        })
        
        const data = {
            "lastUpdate": new Date().toLocaleDateString(),
            "games": lastGames
        }

        await writeJson.execute(data, "src/data/LastGames.json")
    }

    private scrape = async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.ogol.com.br/team_results.php?id=2240&epoca_id=150')

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

        const result = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('tr.parent>td.result'), e => e.textContent)
        })

        const field = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('tr.parent>td'), e => e.textContent)
            return array.filter((value) => {
                if (value.includes('(')) {
                    return value
                } else if (value === "") {
                    return value
                }
            })
        })
        
        const lastGames: LastGames[] = [];

        for (let index = 0; index < 10; index++) {
            let score = result[index].split('-')

            let home: string
            let away: string
            if (field[index] === '(F)') {
                home = teams[index]
                away = 'Flamengo'
            } else if (field[index] === '(C)' || field[index] === "") {
                away = teams[index]
                home = 'Flamengo'
            }

            let game: LastGames = {
                competition: competitions[index],
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