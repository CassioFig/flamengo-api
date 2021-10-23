import { NextGames, ServiceCommand } from "../interfaces";
import { WriteJson } from "../utils";
import puppeteer from 'puppeteer'


export class GetNextGames implements ServiceCommand {
    async execute(): Promise<any> {
        const writeJson = new WriteJson()
        const nextGames = await this.scrape().then((value) => {
            return value
        })

        const data = {
            "lastUpdate": new Date().toLocaleDateString(),
            "games": nextGames
        }
        
        await writeJson.execute(data, "src/data/NextGames.json")
    }

    private scrape = async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.ogol.com.br/team_fixtures.php?id=2240&epoca_id=150')

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

        const date = await page.evaluate(() => {
            const array = Array.from(document.querySelectorAll('tr.parent>td.double'), e => e.textContent)
            return array.filter((value, index) => {
                if (index % 2 === 0) {
                    return value
                }
            })
        })

        const time = await page.evaluate(() => {
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
                    date: date[index],
                    time: time[index]
                }

                if (!competitions[index]) { break }
                nextGames.push(game)
                count++
            }
        }
        return nextGames
    }
}