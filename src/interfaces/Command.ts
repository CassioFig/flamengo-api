import { Request, Response } from "express";

export interface ServiceCommand {
    execute(...playload: any[]): Promise<any>
}

export interface ControllerCommand {
    handle(request: Request, response: Response): Promise<any>
}