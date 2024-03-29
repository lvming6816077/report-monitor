import {
    Body,
    Controller,
    Query,
    Get,
    Param,
    Post,
    Headers,
    HttpException,
} from '@nestjs/common';
import { ReportService, resultVo } from './report.service';
import { formatData, formatSpeedData } from 'src/utils/report/formatReportData';
import { Report, ReportDocument } from './schemas/report.schema';
import * as moment from 'moment';
import { IpAddress } from 'src/utils/decorator/ip.decorator';
import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { PaginateResult } from 'mongoose';
import { QueryReportDto } from './dto/query-report.dto';

const UnitMap = {
    h: 60,// 分钟
    m: 1,// 分钟
    d: 'd',// 天
};

export type GroupReportType = Pick<QueryReportDto,"pointCode"|"timeStart"|"timeEnd">
export type UVResultVo = {
    time:string,
    total:number
}

const unit = UnitMap.h; 
const speedUnit = UnitMap.h;


@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    // get请求上报
    @Get('create')
    async create(@Query() query,@IpAddress() clinetIp: string,@Headers() headers,) {

        const ua = headers['user-agent'] || '';
        const referer = headers['referer'] || '';
        return await this.reportService.create(query.code,clinetIp,ua,referer);
    }
    // post请求上报
    @Post('create')
    async createpost(@Query() query,@Body() body,@IpAddress() clinetIp: string,@Headers() headers,) {
        console.log(headers)
        const ua = headers['user-agent'] || '';
        const referer = headers['referer'] || '';
        return await this.reportService.create(query.code,clinetIp,ua,referer,body);
    }

    @Get('createspeed')
    async createSpeed(@Query() query) {
        if (!query.d) return 'error';
        return await this.reportService.createSpeed(query.code, query.d);
    }

    @Get('getReports')
    async getReports(): Promise<Report[]> {
        return this.reportService.findAll();
    }

    @Get('getReportsByPage')
    async getReportsByPage(
        @Query() query: QueryReportDto,
    ): Promise<PaginateResult<ReportDocument>> {
        
        return this.reportService.findAllReportByPointByPage(
            query.pageStart,
            query.pageSize,
            query,
        );
    }


    @Get('getReportsByCount')
    async getReportsByCount(
        @Query() query: GroupReportType,
    ): Promise<Report[]> {

        return this.reportService.findAllReportGroupByIp(query);
    }

    @Post('getReportsByUV')
    async getReportsByUV(
        @Body() body: GroupReportType,
    ): Promise<UVResultVo[]> {
        const diff = moment(body.timeEnd).diff(moment(body.timeStart),'days');
        // console.log(diff)
        // 小于1天，直接取一天内数据
        if (diff < 1) {
            var r = await this.reportService.findAllReportGroupByIp(body);
            return [{time:moment(body.timeStart).format('YYYY-MM-DD'),total:r.length}]
        } else {
            var list:UVResultVo[] = []
            var cur = moment(body.timeStart).toDate()
            while(cur < moment(body.timeEnd).toDate()) {
                var r = await this.reportService.findAllReportGroupByIp({timeStart:cur.toString(),timeEnd:moment(cur).endOf('day').toString(),pointCode:body.pointCode});
                
                var o = {
                    time:moment(cur).format('YYYY-MM-DD'),
                    total:r.length
                }
                list.push(o)
                cur = moment(cur).add(1,'days').startOf('day').toDate()
            }
            return list
        }
        
    }

    @Post('getReportsGroup')
    async getReportsGroup(@Body() body): Promise<Report[]> {
        const start: string = body.start,
            end: string = body.end,
            unit:any = UnitMap[body.unit];
        const data: resultVo = await this.reportService.findAllByCode(
            body.code,
            start,
            end,
            unit,
        );

        return formatData(data.list, start, end, unit);
    }

    @Post('getReportsGroupToday')
    async getReportsGroupToday(@Body() body): Promise<unknown> {
        const codes: string[] = body.codes || [];
        const start: string = moment()
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss');
        const end: string = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

        const res = [];

        for (let i = 0; i < codes.length; i++) {
            const data: resultVo = await this.reportService.findAllByCode(
                codes[i],
                start,
                end,
                unit,
            );

            res.push({
                code: codes[i],
                desc: data.desc,
                list: formatData(data.list, start, end, unit),
            });
        }

        return res;
    }

    @Post('getSpeedsGroupToday')
    async getSpeedsGroupToday(@Body() body): Promise<unknown> {
        const codes: string[] = body.codes || [];
        const start: string = moment()
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss');
        const end: string = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

        const res = [];

        for (let i = 0; i < codes.length; i++) {
            const data: resultVo = await this.reportService.findAllSpeedByCode(
                codes[i],
                start,
                end,
                speedUnit,
            );

            res.push({
                code: codes[i],
                desc: data.desc,
                list: formatSpeedData(data.list, start, end, speedUnit),
            });
        }

        return res;
    }
    @Post('getSpeedsGroup')
    async getSpeedsGroup(@Body() body): Promise<Report[]> {
        const start: string = body.start,
            end: string = body.end;
        const data: resultVo = await this.reportService.findAllSpeedByCode(
            body.code,
            start,
            end,
            speedUnit,
        );

        return formatSpeedData(data.list, start, end, speedUnit);
    }

    @Get(':id')
    async getReportById(@Param('id') id: string): Promise<Report> {
        return this.reportService.findOne(id);
    }

    @Post('getReportsGroupProvince')
    async getReportsGroupProvince(@Body() query:GroupReportType): Promise<any> {
        const code: string = query.pointCode;
        // console.log(query)
        if (!code) {
            throw new HttpException('pointCode缺失', 200);
        }

        return await this.reportService.findAllReportGroupByProvince(query)
    }

    //   @Delete(':id')
    //   async delete(@Param('id') id: string) {
    //     return this.catsService.delete(id);
    //   }
}
