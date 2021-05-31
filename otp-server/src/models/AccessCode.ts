import {Table, Column, Model, DataType} from "sequelize-typescript";
import {SymptomsTypes} from "../enums/SymptomsTypes";

@Table({timestamps: true, tableName: "access_codes", freezeTableName: true})
export class AccessCode extends Model<AccessCode> {
  @Column({type: DataType.STRING, field: "code"})
  Code: string;

  @Column({type: DataType.STRING, field: "userId"})
  UserId: string;

  @Column({type: DataType.BOOLEAN, field: "isActive"})
  IsActive: boolean;

  @Column({type: DataType.BOOLEAN, field: "isUsed"})
  IsUsed: boolean;

  @Column({type: DataType.DATE, field: "testDate", allowNull: true})
  testDate: Date;

  @Column({type: DataType.DATE, field: "symptomDate", allowNull: true})
  symptomDate: Date;

  @Column({type: DataType.INTEGER, field: "symptoms", allowNull: true})
  symptoms: number;

  @Column({type: DataType.INTEGER, field: "range", allowNull: true})
  range: SymptomsTypes;
}
