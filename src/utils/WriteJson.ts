import { ServiceCommand } from "../interfaces/Command";
import { writeFileSync } from "fs";

export class WriteJson implements ServiceCommand {
    async execute(data_: any, path: string): Promise<void> {
        const data = JSON.stringify(data_)
        writeFileSync(path, data)
    }
}