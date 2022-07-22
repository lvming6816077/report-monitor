
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Log, LogSchema } from "./schemas/log.schema";
import { LogController } from "./log.controller";
import { LogService } from "./log.service";
import { PointModule } from '../point/point.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),PointModule],
    controllers: [LogController],
    providers: [LogService],
    exports: [LogService],
})
export class LogModule {}