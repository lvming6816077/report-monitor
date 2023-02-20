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

    @IsOptional()
    @IsBoolean()
    readonly noCapt?: boolean;

    @IsOptional()
    @IsString()
    readonly projectCode?: string;
}
