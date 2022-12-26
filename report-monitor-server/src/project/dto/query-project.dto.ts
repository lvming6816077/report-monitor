import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { User } from 'src/user/schemas/user.schema';
export class QueryProjectDto implements QueryPageDto {
    
    @IsString()
    pageStart: string;
    @IsString()
    pageSize: string;


}
