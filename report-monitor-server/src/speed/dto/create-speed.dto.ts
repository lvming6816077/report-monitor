import {
    IsInt,
    IsString,
    IsEmpty,
    IsNotEmpty,
    Allow,
    isString,
    IsOptional,
    IsBoolean,
} from 'class-validator';
import { Speed } from '../schemas/speed.schema';

export class CreateSpeedDto extends Speed {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsBoolean()
    readonly isBlock: boolean;

    @IsString()
    readonly tagId: string;
    @IsString()
    readonly desc: string;

    @IsString()
    readonly projectId: string;
}
