import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';
import { Point, PointDocument } from '../schemas/point.schema';
import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { User } from 'src/user/schemas/user.schema';
import { Tag } from '../schemas/tag.schema';
import { Project } from 'src/project/schemas/project.schema';
export class QueryTagDto implements QueryPageDto,Tag {
    project: Project;
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

    @IsString()
    projectId: string;


}
