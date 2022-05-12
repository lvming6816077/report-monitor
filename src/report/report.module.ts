
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Report, ReportSchema } from "./schemas/report.schema";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { PointModule } from '../point/point.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),PointModule],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService],
})
export class ReportModule {}