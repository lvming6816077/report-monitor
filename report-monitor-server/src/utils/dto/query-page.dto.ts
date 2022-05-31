import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

export interface QueryPageDto {

  
  readonly pageStart: string;


  readonly pageSize: string;


}
