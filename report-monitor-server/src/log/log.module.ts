
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Log, LogSchema } from "./schemas/log.schema";
import { LogController } from "./log.controller";
import { LogService } from "./log.service";
import { PointModule } from '../point/point.module';
import { ProjectModule } from "src/project/project.module";

@Module({
    imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),PointModule,ProjectModule],
    controllers: [LogController],
    providers: [LogService],
    exports: [LogService],
})
export class LogModule {}