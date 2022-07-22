import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';
import { Point, PointDocument } from '../schemas/point.schema';
import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { User } from 'src/user/schemas/user.schema';
import { Tag } from '../schemas/tag.schema';
export class QueryTagDto implements QueryPageDto,Tag {
    _id: string;
    readonly code: string;
    
    readonly desc: string;
    readonly user: User;
    readonly create: string;
    readonly update: string;
    @IsString()
    pageStart: string;
    @IsString()
    pageSize: string;


}
