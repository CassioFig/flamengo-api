import { Model, model, Schema } from "mongoose";
import { DataInterface } from "../interfaces";

const DataSchema = new Schema<DataInterface>({
    service: { type: String, required: true },
    lastUpdate: { type: String, required: true },
    data: { type: {}, required: true }
})

export const Data: Model<DataInterface> = model<DataInterface>('Data', DataSchema)