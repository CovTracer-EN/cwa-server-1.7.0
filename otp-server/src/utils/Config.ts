import {logger} from "./Logger";
import * as dotenv from "dotenv";
import * as fs from "fs";

if (fs.existsSync(".env")) {
  dotenv.config({path: ".env"});
  logger.debug("Using .env file to supply config environment variables");
}

export const ENVIRONMENT = process.env.NODE_ENV;

export const PORT = process.env.PORT;
export const WSPORT = parseInt(process.env.WSPORT);
export const DATABASE_DIALECT: "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql" | undefined = process.env.DATABASE_DIALECT as any;
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT: number = parseInt(process.env.DATABASE_PORT as string);
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_USER_NAME = process.env.DATABASE_USER_NAME;
export const DATABASE_USER_PASSWORD = process.env.DATABASE_USER_PASSWORD && process.env.DATABASE_USER_PASSWORD !== "" ? process.env.DATABASE_USER_PASSWORD : undefined;
export const TOKEN_EXPIRES_IN_ACCESS = parseInt(process.env.TOKEN_EXPIRES_IN_ACCESS as string);
export const CODE_EXPIRATION_DURATION = parseInt(process.env.CODE_EXPIRATION_DURATION.toString());
export const TOKEN = process.env.TOKEN;
export const TIME_DEFAULT_FORMAT = "HH:mm";
