import * as bodyParser from "body-parser";
import {Server} from "@overnightjs/core";
import {PORT} from "./utils/Config";
import * as controllers from "./controllers";
import {logger} from "./utils/Logger";
import passport from "passport";
import * as express from "express";

class App extends Server {
  private readonly SERVER_STARTED = "Server started on port: ";

  constructor() {
    super(true);

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));

    this.app.use(passport.initialize());

    this.app.use("/public", express.static("public", {maxAge: 31557600000}));

    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, FhirAuth, X-Site-Lang, token");
      next();
    });

    this.setupControllers();
  }

  public start(): void {
    console.log(`Starting server at ${PORT}`);
    const port: number = Number(PORT) || 3000;
    this.app.get("*", (req, res) => {
      res.send(this.SERVER_STARTED + port);
    });
    this.app.listen(port, () => {
      logger.debug(this.SERVER_STARTED + port);
    });
  }

  public error(error: any): void {
    logger.error(error);
  }

  private setupControllers(): void {
    const ctlrInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        const controller = (controllers as any)[name];
        ctlrInstances.push(new controller());
      }
    }
    super.addControllers(ctlrInstances);
  }
}

export const app = new App();
