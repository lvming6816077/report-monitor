


import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ReportModule } from '../report/report.module';
@Module({
    imports:[ReportModule],
    providers: [TasksService],
})
export class TasksModule {}