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
export class UpdateUserProjectDto {
    @IsNotEmpty()
    @IsString()
    activePid: string;
}
