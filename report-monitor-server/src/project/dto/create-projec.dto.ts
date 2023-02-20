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
    IsFQDN,
} from 'class-validator';

import { Optional } from '@nestjs/common';
export class CreateProjectDto {
    projectid: string;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsFQDN({message:'请输入合法域名'})
    host: string;

    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    desc: string;
}
