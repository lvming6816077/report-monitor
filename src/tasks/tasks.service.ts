import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { ReportService } from 'src/report/report.service';
import { RedisInstanceService } from 'src/config/redis-config/redis.service';


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

//   @Timeout(5000)
//   handleTimeout() {
//       console.log(222)
//     this.logger.debug('Called once after 5 seconds');
//   }
}