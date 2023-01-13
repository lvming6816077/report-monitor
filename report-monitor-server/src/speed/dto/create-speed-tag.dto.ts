
import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

export class CreateSpeedTagDto {

  @IsString()
  readonly desc: string;

  @IsString()
  readonly projectId: string;
  
  @IsOptional()
  @IsString()
  readonly tagId: string;


  
}
