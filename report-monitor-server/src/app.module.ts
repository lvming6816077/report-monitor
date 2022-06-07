import { Module,Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportModule } from './report/report.module';
import { PointModule } from './point/point.module';
import { ConfigModule } from './config/config.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { WarningModule } from './warning/warning.module'
import { AllExceptionsFilter } from './utils/response/filter/http-execption.filter';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/report'),ScheduleModule.forRoot(), ReportModule,PointModule,ConfigModule,TasksModule,UserModule,WarningModule],
  controllers: [],
  providers: [AllExceptionsFilter],
  exports:[AllExceptionsFilter]
})
export class AppModule {}
