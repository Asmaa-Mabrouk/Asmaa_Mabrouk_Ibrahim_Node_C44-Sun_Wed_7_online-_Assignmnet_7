import Log from "../../../database/models/log.model.js";

export const createLog = (data) => new Log(data).save();
