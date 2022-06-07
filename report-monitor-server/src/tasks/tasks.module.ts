


import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ReportModule } from '../report/report.module';
import { WarningModule } from 'src/warning/warning.module';
@Module({
    imports:[ReportModule,WarningModule],
    providers: [TasksService],
})
export class TasksModule {}