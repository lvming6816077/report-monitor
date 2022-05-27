import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

export class QueryPageDto {

  @IsString()
  readonly pageStart: string;

  @IsString()
  readonly pageSize: string;

//   readonly ss:string;
}
