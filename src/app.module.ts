import { Module,Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportModule } from './report/report.module';
import { PointModule } from './point/point.module';
import { ConfigModule } from './config/config.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/report'),ScheduleModule.forRoot(), ReportModule,PointModule,ConfigModule,TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
