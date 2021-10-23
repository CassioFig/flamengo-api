import { ServiceCommand } from "../interfaces/Command";
import { readFileSync } from 'fs'

export class ReadJson implements ServiceCommand {
    async execute(path: string): Promise<JSON> {
        const data = readFileSync(path, 'utf-8')
        return JSON.parse(data)
    }
}