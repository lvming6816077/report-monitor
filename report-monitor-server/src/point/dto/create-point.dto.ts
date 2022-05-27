import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

export class CreatePointDto {

  @IsOptional()
  @IsString()
  readonly name: string;


  @IsString()
  readonly tagId: string;
  @IsString()
  readonly desc: string;
}
