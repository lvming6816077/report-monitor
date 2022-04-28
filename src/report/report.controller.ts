import { Body, Controller, Query, Get, Param, Post } from '@nestjs/common';
import { ReportService } from './report.service';
const parser = require('cron-parser');
import { Report } from './schemas/report.schema';
import * as dayjs from 'dayjs'

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('create')
  async create(@Query() query:any) {
    //   console.log(query)
      return await this.reportService.create(query.code);
  }

  @Get('getReports')
  async getReports(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Get('getReportsGroup')
  async getReportsGroup(@Query() query:any): Promise<Report[]> {
    let start:string = query.start,end:string = query.end
    let data:any[] = await this.reportService.findAllByCode(query.code,start,end);

    return this.formatData(data,start,end)
  }

  @Post('getReportsGroupToday')
  async getReportsGroupToday(@Body() body): Promise<any> {
    let codes:string[] = body.codes||[]
    let start:string = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    let end:string = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    let res = []
    for (let i = 0 ; i < codes.length ; i++) {
        
        let data:any[] = await this.reportService.findAllByCode(codes[i],start,end);

        res.push({
            code:codes[i],
            list:this.formatData(data,start,end)
        })

    }
    
    return res
  }

  @Get(':id')
  async getReportById(@Param('id') id: string): Promise<Report> {
    return this.reportService.findOne(id);
  }

  formatData(data:any[],currentDate:string,endDate:string){
    if (data.length == 0) return []
    let map = {}
    data.forEach(item=>{
        map[item._id] = item.total
    })
    const options = {
        currentDate: new Date(currentDate),
        endDate: new Date(endDate),
        iterator: true,
    };
    const interval = parser.parseExpression('*/60 * * * * *', options);
    var list = []
    while (true) { // eslint-disable-line
        try {
            const dateStr = dayjs(new Date(interval.next().value.toString())).format('YYYY-MM-DD HH:mm');

            if (map[dateStr]) {
                list.push({
                    time:dateStr,
                    total:map[dateStr]
                })
            } else {
                list.push({
                    time:dateStr,
                    total:0 // 补0
                })
            }
        } catch (e) {
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