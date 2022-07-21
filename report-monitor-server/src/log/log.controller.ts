import { Body, Controller, Query, Get, Param, Post, Injectable } from '@nestjs/common';
import { LogService,resultVo } from './log.service';
import {formatData} from 'src/utils/report/formatReportData'

import * as moment from 'moment'


const unit = 1// 分钟
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) { }

  @Post('create')
  async createLog(@Body() dto: any) {
      console.log(dto)
      return await this.logService.create(dto);
  }

  //   @Delete(':id')
  //   async delete(@Param('id') id: string) {
  //     return this.catsService.delete(id);
  //   }
}