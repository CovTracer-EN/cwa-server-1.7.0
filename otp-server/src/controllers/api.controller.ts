import {Response} from "express";
import {HTTPStatusCode} from "../enums/HttpStatusCode";
import {logger} from "../utils/Logger";

export class ApiController {
  protected OK(data: any, res: Response) {
    res.json(data);
  }

  protected Unauthorized(res: Response) {
    res.status(HTTPStatusCode.UNAUTHORIZED);
    res.json({});
  }

  protected InternalServerError(message: any, res: Response) {
    let errorMessage: any = message;
    if (errorMessage.message) {
      errorMessage = errorMessage.message;
    }
    logger.error(JSON.stringify({message: errorMessage, date: new Date().toISOString()}));

    res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR);
    res.json({error: errorMessage});
  }
}
