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

@Injectable()
export class TasksService {
    constructor(
        private readonly reportService: ReportService,
        private readonly warningService: WarningService,
        private readonly mailerService: MailerService,


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