import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

export class LoginDto {


  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
  @IsString()
  readonly checkcode: string;
  @IsString()
  @IsOptional()
  readonly nickname?: string;
}
