import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ReportModule } from '../report/report.module';
import { WarningModule } from 'src/warning/warning.module';
import { LogModule } from 'src/log/log.module';
@Module({
    imports: [ReportModule, WarningModule, LogModule],
    providers: [TasksService],
})
export class TasksModule {}
