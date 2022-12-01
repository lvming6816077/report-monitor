import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional, IsBoolean } from 'class-validator';
import { Point } from '../schemas/point.schema';

export class CreatePointDto extends Point {

  @IsOptional()
  @IsString()
  readonly name: string;
  
  @IsOptional()
  @IsBoolean()
  readonly isBlock:boolean

  @IsString()
  readonly tagId: string;
  @IsString()
  readonly desc: string;

  @IsString()
  readonly projectId: string;


}
