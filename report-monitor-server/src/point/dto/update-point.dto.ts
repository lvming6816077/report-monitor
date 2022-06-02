import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional, IsBoolean } from 'class-validator';
import { Point } from '../schemas/point.schema';

export class UpdatePointDto extends Point {

  @IsOptional()
  @IsString()
  readonly name: string;
  
  @IsOptional()
  @IsBoolean()
  readonly isBlock:boolean


  @IsString()
  _id:string
}
