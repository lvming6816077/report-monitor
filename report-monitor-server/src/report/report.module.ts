
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Report, ReportSchema } from "./schemas/report.schema";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { PointModule } from '../point/point.module';
import { SpeedModule } from "src/speed/speed.module";

@Module({
    imports: [MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),PointModule,SpeedModule],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService],
})
export class ReportModule {}