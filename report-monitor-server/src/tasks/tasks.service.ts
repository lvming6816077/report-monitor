import { Inject, Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { ReportService } from 'src/report/report.service';
import { RedisInstanceService } from 'src/config/redis-config/redis.service';
import * as moment from 'moment'
import { WarningService } from 'src/warning/warning.service';
import { WarningDocument } from 'src/warning/schemas/warning.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';

@Injectable()
export class TasksService {
    constructor(
        private readonly reportService: ReportService,
        private readonly warningService: WarningService,


        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        ) { 

        }

//   @Cron('10 * * * * *') 
//   async handleCron() {
//     const client:Redis = await this.redisService.getClient()
//     // console.log(client.rpop('report_monitor_ls'))
//     console.log(111)
//   }


  // 上报定时任务
  @Interval(10000)
  async handleInterval() {

    this.reportService.createByTask()
    
  }


  // 监控定时任务
  @Interval(10000)
  async handleCusInterval() {

    const list = await this.warningService.findAllOpened()

    list.forEach(item=>{

        if (item.max && item.interval && item.point.code) {
            this.dealSingleTask(item)
        }
    })


  }


  async dealSingleTask(item:WarningDocument){

    const interval = item.interval
    const code = item.point.code
    const max = item.max


    const cur = moment().subtract(interval,'minute').format('YYYY-MM-DD HH:mm:ss')
    const next = moment().format('YYYY-MM-DD HH:mm:ss')


    const result = await this.reportService.findAllByCode(code,cur,next,interval)

o
    for (var i = 0 ; i < result.list.length ; i++) {
        var o = result.list[i] as any
        const { triggerCount,triggerMax } = await this.warningService.findById(item._id)

        if (o.count >= max && triggerCount<triggerMax) {
            
            const msg = '【'+item.point.code+'】触发监控：'+item.message
            this.logger.info(msg)
            console.log(msg)
            // 触发次数加1
            this.warningService.updateWarningTrigger(item._id)
            break
        }
    }
  }

  

//   @Timeout(5000)
//   handleTimeout() {
//       console.log(222)
//     this.logger.debug('Called once after 5 seconds');
//   }
}