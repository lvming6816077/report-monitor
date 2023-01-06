import { IsInt, IsString,IsEmpty,IsNotEmpty, Allow, isString, IsOptional } from 'class-validator';

import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { User } from 'src/user/schemas/user.schema';

import { Project } from 'src/project/schemas/project.schema';
import { Log } from './log.schema';
export class QueryLogDto implements QueryPageDto,Log {
    meta: any;
    ip: string;
    ua: string;
    create: string;
    update: string;
    str: string;
    project: Project;
    @IsString()
    projectId: string;
    @IsString()
    pageStart: string;
    @IsString()
    pageSize: string;

    timeStart:string;
    timeEnd:string;
    

}
