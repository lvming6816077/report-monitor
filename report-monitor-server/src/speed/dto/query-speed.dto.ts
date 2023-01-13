import {
    IsInt,
    IsString,
    IsEmpty,
    IsNotEmpty,
    Allow,
    isString,
    IsOptional,
} from 'class-validator';
import { Speed, SpeedDocument } from '../schemas/speed.schema';
import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { User } from 'src/user/schemas/user.schema';
import { SpeedTag } from '../schemas/speedtag.schema';
import { Project } from 'src/project/schemas/project.schema';
export class QuerySpeedDto implements QueryPageDto, Speed {
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
    readonly tag: SpeedTag;
    readonly user: User;
    readonly create: string;
    readonly update: string;
}
