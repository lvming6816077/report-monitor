import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

export class CreatePointDto {

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsInt()
  readonly age: number;
  
  @IsOptional()
  @IsString()
  readonly breed: string;

  @IsString()
  readonly desc: string;
}
