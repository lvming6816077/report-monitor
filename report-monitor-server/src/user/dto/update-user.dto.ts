import {
    IsInt,
    IsString,
    IsEmpty,
    IsNotEmpty,
    isString,
    IsOptional,
    IsArray,
    IsPhoneNumber,
    IsEmail,
} from 'class-validator';

import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { User } from 'src/user/schemas/user.schema';
import { Optional } from '@nestjs/common';
export class UpdateUserDto {
    @IsString()
    @IsOptional()
    nickname?: string;

    @IsEmpty()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsArray()
    @IsOptional()
    level?: number[];

    @IsArray()
    @IsOptional()
    projectsid?: string[];

    @IsString()
    @IsOptional()
    pointset?: string;

    @IsString()
    @IsOptional()
    speedset?: string;

    @IsString()
    userid?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    activePid?: string;
}
