import {Response, Request, NextFunction} from "express";
import {Controller, ClassMiddleware, Post, Get, Put, Patch, Delete} from "@overnightjs/core";
import {ApiController} from "./api.controller";
import {codeGeneratorService} from "../services/code-generator.service";
import moment from "moment";
import {CODE_EXPIRATION_DURATION, TOKEN} from "../utils/Config";
import Joi from "@hapi/joi";
import {HTTPStatusCode} from "../enums/HttpStatusCode";
import {AccessCodeStatusTypes} from "../enums/AccessCodeStatusTypes";
import {SymptomsTypes} from "../enums/SymptomsTypes";

const checkCodeValidatorSchema = Joi.object({
  code: Joi.string().required().length(12),
  userId: [Joi.string().allow(null), Joi.allow(null)]
});

interface ICheckCode {
  code: string;
  userId: string;
}

const createCodeValidatorSchema = Joi.object({
  userId: Joi.string().required(),
  testDate: [Joi.date().allow(null), Joi.allow(null)],
  symptomDate: [Joi.date().allow(null), Joi.allow(null)],
  symptoms: [Joi.number().allow(null), Joi.allow(null)],
  range: [Joi.number().allow(null), Joi.allow(null)]
});

interface ICreateCode {
  userId: string;
  testDate: Date;
  symptomDate: Date;
  symptoms?: SymptomsTypes;
  range?: number;
}

@Controller("api/code-generator")
export class CodeGeneratorController extends ApiController {

  @Get("")
  async getAccessCodeByCode(req: Request, res: Response, next: NextFunction) {
    try {

      const token = req.header("token");
      if (!token) {
        return this.Unauthorized(res);
      }

      if (token !== TOKEN) {
        return this.Unauthorized(res);
      }

      const entity = await codeGeneratorService.getByCode(req.query.code as string);

      const expiresAt = moment(entity.createdAt).add(CODE_EXPIRATION_DURATION, "days").toDate().toISOString();

      const responseObject = {
        Code: entity.Code,
        IsActive: entity.IsActive,
        IsUsed: entity.IsUsed,
        testDate: entity.testDate,
        symptomDate: entity.symptomDate,
        expiresAt
      };

      this.OK(responseObject, res);
    } catch (e) {
      this.InternalServerError(e, res);
    }
  }

  @Post()
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const model = await createCodeValidatorSchema.validateAsync(req.body) as ICreateCode;

      const token = req.header("token");
      if (!token) {
        return this.Unauthorized(res);
      }

      if (token !== TOKEN) {
        return this.Unauthorized(res);
      }

      const entity = await codeGeneratorService.create(model.userId, model.testDate, model.symptomDate, model.symptoms, model.range);

      const expiresAt = moment(entity.createdAt).add(CODE_EXPIRATION_DURATION, "days").toDate().toISOString();

      this.OK({code: entity.Code, expiresAt}, res);
    } catch (e) {
      this.InternalServerError(e, res);
    }
  }

  @Post("consume")
  async consume(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("token");
      if (!token) {
        return this.Unauthorized(res);
      }

      if (token !== TOKEN) {
        return this.Unauthorized(res);
      }
      const model = await checkCodeValidatorSchema.validateAsync(req.body);

      const status = await codeGeneratorService.consume(model);

      this.OK({status}, res);
    } catch (e) {
      this.InternalServerError(e, res);
    }
  }

  @Post("check")
  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("token");
      if (!token) {
        return this.Unauthorized(res);
      }

      if (token !== TOKEN) {
        return this.Unauthorized(res);
      }

      let model;
      try {
        model = await checkCodeValidatorSchema.validateAsync(req.body) as ICheckCode;
      } catch (err) {
        res.status(HTTPStatusCode.BAD_REQUEST);
        return res.json({error: err.details[0].message});
      }

      const codeStatus = await codeGeneratorService.checkStatus(model);

      const result = {
        status: codeStatus.status,
        statusText: ""
      };

      switch (codeStatus.status) {
        case AccessCodeStatusTypes.Expired:
          result.statusText = "expired";
          break;
        case AccessCodeStatusTypes.Invalid:
          result.statusText = "invalid";
          break;
        case AccessCodeStatusTypes.Valid:
          result.statusText = "valid";
          break;
        case AccessCodeStatusTypes.Used:
          result.statusText = "used";
          break;
      }

      this.OK(result, res);
    } catch (e) {
      this.InternalServerError(e, res);
    }
  }
}
