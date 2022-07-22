import { Body, Controller, Query, Get, Param, Post, Request, HttpException } from '@nestjs/common';
import { LogService,resultVo } from './log.service';
import {formatData} from 'src/utils/report/formatReportData'

import * as moment from 'moment'
import { Request as _Request} from 'express';
import { PointService } from 'src/point/point.service';



@Controller('log')
export class LogController {
  constructor(
    private readonly logService: LogService,
    
    private readonly pointService: PointService,
    ) { }

  @Post('create/:tc')
  async createLog(@Body() dto: any, @Request() req: _Request,@Param('tc') tc: string) {

    //   const tc = req.query?.tc

      if (!tc) {
        throw new HttpException('tid缺失', 200);
      }

      const tag = await this.pointService.findOneTagByCode(tc as string)

      if (!tag) {
        throw new HttpException('tid不存在', 200);
      }

      return await this.logService.create(JSON.stringify(dto),tag._id);
  }

  @Get('list')
  async getLogList(@Request() req: _Request) {
    const list = await this.logService.findAll();

    
    return list.filter(i=>i.str)
  }

  //   @Delete(':id')
  //   async delete(@Param('id') id: string) {
  //     return this.catsService.delete(id);
  //   }
}