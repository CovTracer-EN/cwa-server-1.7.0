import {AccessCode} from "../models/AccessCode";
import {helpers} from "../utils/helpers.util";
import {AccessCodeStatusTypes} from "../enums/AccessCodeStatusTypes";
import moment from "moment";
import {CODE_EXPIRATION_DURATION} from "../utils/Config";
import {SymptomsTypes} from "../enums/SymptomsTypes";

class CodeGeneratorService {
  public async getByCode(code: string) {
    const accessCode = await AccessCode.findOne({
      where: {
        Code: code
      }
    });

    return accessCode;
  }

  public async create(userId: string, testDate: Date, symptomDate: Date, symptoms?: SymptomsTypes, range?: number) {
    await this.disableAllUserCode(userId);

    const code = await this.getRandomCode(userId);

    const accessCode = await AccessCode.create({
      Code: code,
      UserId: userId,
      IsActive: true,
      testDate,
      symptomDate,
      symptoms,
      range
    });

    return accessCode;
  }

  async checkStatus(model: any): Promise<{ status: AccessCodeStatusTypes }> {
    const accessCode = await AccessCode.findOne({
      where: {
        Code: model.code
      }
    });

    if (!accessCode) {
      return {status: AccessCodeStatusTypes.Invalid};
    }

    if (!accessCode.IsActive) {
      if (accessCode.IsUsed) {
        return {status: AccessCodeStatusTypes.Used};
      }
      return {status: AccessCodeStatusTypes.Invalid};
    }

    const expiresOn = moment(accessCode.createdAt).add(CODE_EXPIRATION_DURATION, "days");
    // const expiresOn = moment(accessCode.createdAt).add(CODE_EXPIRATION_DURATION, "minutes");

    if (expiresOn.isBefore(moment())) {
      return {status: AccessCodeStatusTypes.Expired};
    }

    return {status: AccessCodeStatusTypes.Valid};
  }

  async consume(model: any) {
    const codeIsValid = await this.checkStatus(model);

    if (codeIsValid.status !== AccessCodeStatusTypes.Valid) {
      return false;
    }

    await AccessCode.update({
      IsActive: false,
      IsUsed: true
    }, {
      where: {
        Code: model.code
      }
    });

    return true;
  }

  private async checkCodeExists(code: string) {
    const accessCode = await AccessCode.findOne({
      where: {
        Code: code,
        IsActive: true
      }
    });

    if (!accessCode) return false;

    return true;
  }

  private async getRandomCode(userId: string): Promise<string> {
    const code = helpers.randomNumber(12);

    const codeExists = await this.checkCodeExists(code);
    if (codeExists) {
      return await this.getRandomCode(userId);
    }

    return code;
  }

  private async disableAllUserCode(userId: string) {
    await AccessCode.update({
      IsActive: false
    }, {
      where: {
        UserId: userId
      }
    });
  }
}

export const codeGeneratorService = new CodeGeneratorService();
