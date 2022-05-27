
import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

export class CreateTagDto {

  @IsString()
  readonly desc: string;
  
  @IsOptional()
  @IsString()
  readonly tagId: string;
}
