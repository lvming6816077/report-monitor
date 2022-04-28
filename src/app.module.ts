import { Module,Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportModule } from './report/report.module';
import { PointModule } from './point/point.module';
import { ConfigModule } from './config/config.module';
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/report'), ReportModule,PointModule,ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
