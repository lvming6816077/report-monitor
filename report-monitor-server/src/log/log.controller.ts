import { Body, Controller, Query, Get, Param, Post, Request, HttpException, UseGuards,Headers } from '@nestjs/common';
import { LogService, resultVo } from './log.service';
import { formatData } from 'src/utils/report/formatReportData'

import * as moment from 'moment'
import { Request as _Request } from 'express';
import { PointService } from 'src/point/point.service';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';
import { ProjectService } from 'src/project/project.service';
import { QueryLogDto } from './schemas/query-log.dto';
import { IpAddress } from 'src/utils/decorator/ip.decorator';



@Controller('log')
export class LogController {
    constructor(
        private readonly logService: LogService,

        private readonly pointService: PointService,

        private readonly projectService: ProjectService,
    ) { }

    @Post('create/:pcode')
    async createLog(@Body() dto: any, @Headers() headers, @IpAddress() clinetIp: string,@Param('pcode') pcode: string) {

        if (!pcode) {
            throw new HttpException('pcode缺失', 200);
        }

        const p = await this.projectService.findProjectByCode(pcode)

        if (!p) return ''


        const ua = headers['user-agent']||''

        const ip = clinetIp

        return await this.logService.create(JSON.stringify(dto),ua,ip, p._id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getLogList(@Query() query:QueryLogDto,@Request() req: _Request) {

        return this.logService.findAllByPage(query.pageStart, query.pageSize, query);

        // const tagList = await (await this.pointService.findAllTags()).filter(i => i.code)

        // let list = []

        // for (var i = 0; i < tagList.length; i++) {
        //     let l = await this.logService.findAllByTagId(tagList[i]._id)

        //     if (l.length) {
        //         list.push(l)
        //     }
        // }
        // // 拍平
        // function flatter(arr) {
        //     if (!arr.length) return;
        //     return arr.reduce(
        //         (pre, cur) =>
        //             Array.isArray(cur) ? [...pre, ...flatter(cur)] : [...pre, cur],
        //         []
        //     );
        // }


        // return flatter(list)
    }



    //   @Delete(':id')
    //   async delete(@Param('id') id: string) {
    //     return this.catsService.delete(id);
    //   }
}