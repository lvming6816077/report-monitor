import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { User } from 'src/user/schemas/user.schema';
export class QueryUserDto implements QueryPageDto,User {
    nickname: string;
    create: string;
    update: string;
    userid: string;
    username: string;
    password: string;
    level: [];
    pointset: string;
    
    @IsString()
    pageStart: string;
    @IsString()
    pageSize: string;


}
