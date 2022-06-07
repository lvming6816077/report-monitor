import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Warning } from '../schemas/warning.schema';

export class CreateWarningDto extends Warning {


  @IsNumber()
  readonly interval: number;

  @IsNumber()
  readonly triggerMax: number;
  

  @IsBoolean()
  readonly isOpen: boolean;

  @IsString()
  readonly pointId: string;


  @IsString()
  readonly message: string;

  @IsOptional()
  @IsNumber()
  readonly max: number;

  @IsOptional()
  @IsNumber()
  readonly min: number;
}
