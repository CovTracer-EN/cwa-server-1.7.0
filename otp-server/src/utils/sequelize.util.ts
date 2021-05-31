import {Sequelize} from "sequelize-typescript";
import {
  DATABASE_DIALECT,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_USER_NAME,
  DATABASE_USER_PASSWORD
} from "./Config";

class Database {
  private readonly _sequelize: Sequelize;

  constructor() {
    this._sequelize = new Sequelize({
      dialect: DATABASE_DIALECT,
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      database: DATABASE_NAME,
      username: DATABASE_USER_NAME,
      password: DATABASE_USER_PASSWORD,
      modelPaths: [__dirname + "/../models"],
      logging: false,
      sync: {
        force: false
      },
      pool: {
        max: 30,
        min: 2,
        idle: 10000
      }
    });
  }

  public GetSequelize() {
    return this._sequelize;
  }
}

const database = new Database();
export const sequelize = database.GetSequelize();
