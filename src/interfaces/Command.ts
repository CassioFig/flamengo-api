export interface ServiceCommand {
    execute(...playload: any[]): Promise<any>
}

export interface ControllerCommand {
    handle(...payload: any[]): Promise<any>
}