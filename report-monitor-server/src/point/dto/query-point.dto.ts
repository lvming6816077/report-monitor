import {
    IsInt,
    IsString,
    IsEmpty,
    IsNotEmpty,
    Allow,
    isString,
    IsOptional,
} from 'class-validator';
import { Point, PointDocument } from '../schemas/point.schema';
import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { User } from 'src/user/schemas/user.schema';
import { Tag } from '../schemas/tag.schema';
import { Project } from 'src/project/schemas/project.schema';
export class QueryPointDto implements QueryPageDto {
    project: Project;
    @IsString()
    projectId: string;
    isBlock: boolean;
    @IsString()
    pageStart: string;
    @IsString()
    pageSize: string;

    readonly desc: string;
    readonly code: string;
    readonly tag: Tag;
    readonly user: User;
    readonly create: string;
    readonly update: string;
}
