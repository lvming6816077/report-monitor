import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { ReportService } from 'src/report/report.service';
import { RedisInstanceService } from 'src/config/redis-config/redis.service';
import * as moment from 'moment'


@Injectable()
export class TasksService {
    constructor(
        private readonly reportService: ReportService,
        ) { 

        }

//   @Cron('10 * * * * *') 
//   async handleCron() {
//     const client:Redis = await this.redisService.getClient()
//     // console.log(client.rpop('report_monitor_ls'))
//     console.log(111)
//   }

  @Interval(10000)
  async handleInterval() {

    this.reportService.createByTask()
    
  }

  @Interval(10000)
  async handleCusInterval() {

    // const cur = moment().subtract(30,'minute').format('YYYY-MM-DD HH:mm:ss')
    // const next = moment().format('YYYY-MM-DD HH:mm:ss')
    // console.log(cur,next)

    // const result = await this.reportService.findAllByCode('342786',cur,next,10)
    // console.log(result)
    
  }

  

//   @Timeout(5000)
//   handleTimeout() {
//       console.log(222)
//     this.logger.debug('Called once after 5 seconds');
//   }
}