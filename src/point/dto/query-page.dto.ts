import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';
import { Point, PointDocument } from '../schemas/point.schema';
export class QueryPageDto extends Point {

  @IsString()
  readonly pageStart: string;

  @IsString()
  readonly pageSize: string;
}
