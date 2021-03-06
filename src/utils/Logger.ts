import { pino } from "pino";
export const logger = pino({
    name: "flamengo-api",
    level: "debug",
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})