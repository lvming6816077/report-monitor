import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

export class QueryPageDto {


  readonly pageStart: string;


  readonly pageSize: string;


}
