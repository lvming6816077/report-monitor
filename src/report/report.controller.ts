import { Body, Controller, Query, Get, Param, Post, Injectable } from '@nestjs/common';
import { ReportService,resultVo } from './report.service';
const parser = require('cron-parser');
import { Report } from './schemas/report.schema';
import * as moment from 'moment'


const unit = 10// 分钟
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('create')
  async create(@Query() query: any) {

    return await this.reportService.create(query.code);
  }

  @Get('getReports')
  async getReports(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Post('getReportsGroup')
  async getReportsGroup(@Body() body): Promise<Report[]> {
    let start: string = body.start, end: string = body.end
    let data: resultVo = await this.reportService.findAllByCode(body.code, start, end, unit);

    return this.formatData(data.list, start, end)
  }

  @Post('getReportsGroupToday')
  async getReportsGroupToday(@Body() body): Promise<unknown> {
    let codes: string[] = body.codes || []
    let start: string = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    let end: string = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')

    let res = []

    for (let i = 0; i < codes.length; i++) {

      let data: resultVo = await this.reportService.findAllByCode(codes[i], start, end, unit);
      console.log(data)

      res.push({
        code: codes[i],
        desc:data.desc,
        list: this.formatData(data.list, start, end)
      })

    }

    return res
  }

  @Get(':id')
  async getReportById(@Param('id') id: string): Promise<Report> {
    return this.reportService.findOne(id);
  }

  formatData(data: any[], currentDate: string, endDate: string) {
    if (data.length == 0) return []

    let map = {}
    data.forEach(item => {
      let key = item._id.year + '-' + 
      (item._id.month < 10 ? '0' + item._id.month : item._id.month) + '-' + 
      (item._id.day < 10 ? '0' + item._id.day : item._id.day) + ' ' + 
      (item._id.hour < 10 ? '0' + item._id.hour : item._id.hour) + ':' + 
      (item._id.minute < 10 ? '0' + item._id.minute : item._id.minute)
      map[key] = item.count
    })
    

    const options = {
      currentDate: moment(new Date(currentDate)).subtract(unit, 'minute').toDate(),
      endDate: moment(new Date(endDate)).add(unit, 'minute').toDate(),
      iterator: true,
    };
    const interval = parser.parseExpression('0 */' + unit + ' * * * *', options);
    var list = []
    while (true) { // eslint-disable-line
      try {
        const end = moment(new Date(interval.next().value.toString()));

        const endStr = end.format('YYYY-MM-DD HH:mm')
        if (map[endStr]) {

          list.push({
            time: endStr,
            total: map[endStr]
          })
        } else {
          list.push({
            time: endStr,
            total: 0
          })
        }

      } catch (e) {
        // console.log(e)
        break;
      }
    }
    return list
  }

  //   @Delete(':id')
  //   async delete(@Param('id') id: string) {
  //     return this.catsService.delete(id);
  //   }
}