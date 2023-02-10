import {
    IsInt,
    IsString,
    IsEmpty,
    IsNotEmpty,
    Allow,
    isString,
    IsOptional,
} from 'class-validator';
import { QueryPageDto } from 'src/utils/dto/query-page.dto';

export class QueryReportDto implements QueryPageDto {
    _id:string;
    @IsString()
    pointCode: string;
    @IsString()
    pageStart: string;
    @IsString()
    pageSize: string;

    @IsString()
    timeStart:string;

    @IsString()
    timeEnd:string;

}
