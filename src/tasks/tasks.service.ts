import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { ReportService } from 'src/report/report.service';
import { RedisInstanceService } from 'src/config/redis-config/redis.service';
import { Redis } from 'ioredis';

@Injectable()
export class TasksService {
    constructor(
        private readonly reportService: ReportService,
        private redisService: RedisInstanceService) { 

        }

//   @Cron('10 * * * * *') 
//   async handleCron() {
//     const client:Redis = await this.redisService.getClient()
//     // console.log(client.rpop('report_monitor_ls'))
//     console.log(111)
//   }

  @Interval(10000)
  async handleInterval() {
    try {
        let res = await this.redisService.rpop('report_monitor_ls')

        if (res == null) return
        res = JSON.parse(res)
        this.reportService.createByTask(res.code,res.create)

    }catch(e){
        console.log(e)
    }
    
  }

//   @Timeout(5000)
//   handleTimeout() {
//       console.log(222)
//     this.logger.debug('Called once after 5 seconds');
//   }
}