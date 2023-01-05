import { Inject, Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { ReportService } from 'src/report/report.service';
import { RedisInstanceService } from 'src/config/redis-config/redis.service';
import * as moment from 'moment'
import { WarningService } from 'src/warning/warning.service';
import { WarningDocument } from 'src/warning/schemas/warning.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MailerService } from '@nestjs-modules/mailer';
import { LogService } from 'src/log/log.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly reportService: ReportService,
        private readonly warningService: WarningService,
        private readonly logService: LogService,
        private readonly mailerService: MailerService,


        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

    ) {

    }

     // 定时删除日志任务(每7天23点执行)
      @Cron('0 0 23 1/7 * ?') 
      async handleCron() {

        console.log(111)
        this.logService.deleteLogTask()
      }


    // 上报定时任务
    @Interval(10000)
    async handleInterval() {

        this.reportService.createByTask()

    }


    // 监控告警定时任务
    @Interval(10000)
    async handleCusInterval() {

        this.warningService.dealByTask()

    }


    //   @Timeout(5000)
    //   handleTimeout() {
    //       console.log(222)
    //     this.logger.debug('Called once after 5 seconds');
    //   }
}