import { Body, Controller, Query, Get, Param, Post, Injectable } from '@nestjs/common';
import { ReportService,resultVo } from './report.service';
import { formatData,formatSpeedData } from 'src/utils/report/formatReportData'
import { Report } from './schemas/report.schema';
import * as moment from 'moment'


const unit = 1// 分钟
const speedUnit = 60
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('create')
  async create(@Query() query) {

    return await this.reportService.create(query.code);
  }

  @Get('createspeed')
  async createSpeed(@Query() query) {

    return await this.reportService.createSpeed(query.code,query.d);
  }

  @Get('getReports')
  async getReports(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Post('getReportsGroup')
  async getReportsGroup(@Body() body): Promise<Report[]> {
    let start: string = body.start, end: string = body.end
    let data: resultVo = await this.reportService.findAllByCode(body.code, start, end, unit);

    return formatData(data.list, start, end,unit)
  }

  @Post('getReportsGroupToday')
  async getReportsGroupToday(@Body() body): Promise<unknown> {
    let codes: string[] = body.codes || []
    let start: string = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    let end: string = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')

    let res = []

    for (let i = 0; i < codes.length; i++) {

      let data: resultVo = await this.reportService.findAllByCode(codes[i], start, end, unit);

      res.push({
        code: codes[i],
        desc:data.desc,
        list: formatData(data.list, start, end,unit)
      })

    }

    return res
  }

  @Post('getSpeedsGroupToday')
  async getSpeedsGroupToday(@Body() body): Promise<unknown> {
    let codes: string[] = body.codes || []
    let start: string = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    let end: string = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')

    let res = []

    for (let i = 0; i < codes.length; i++) {

      let data: resultVo = await this.reportService.findAllSpeedByCode(codes[i], start, end, speedUnit);

      res.push({
        code: codes[i],
        desc:data.desc,
        list: formatSpeedData(data.list, start, end,speedUnit)
      })

    }

    return res
  }
  @Post('getSpeedsGroup')
  async getSpeedsGroup(@Body() body): Promise<Report[]> {
    let start: string = body.start, end: string = body.end
    let data: resultVo = await this.reportService.findAllSpeedByCode(body.code, start, end, speedUnit);

    return formatSpeedData(data.list, start, end,speedUnit)
  }

  @Get(':id')
  async getReportById(@Param('id') id: string): Promise<Report> {
    return this.reportService.findOne(id);
  }

  //   @Delete(':id')
  //   async delete(@Param('id') id: string) {
  //     return this.catsService.delete(id);
  //   }
}