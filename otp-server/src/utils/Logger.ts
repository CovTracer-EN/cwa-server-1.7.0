import winston from "winston";
import * as dotenv from "dotenv";
import {ENVIRONMENT} from "./Config";

dotenv.config({path: ".env"});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  // defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({filename: "log/error.log", level: "error"}),
    new winston.transports.File({filename: "log/combined.log"})
  ]
});

if (ENVIRONMENT !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
