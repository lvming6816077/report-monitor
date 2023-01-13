
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Speed, SpeedSchema } from "./schemas/speed.schema";
import { SpeedTag, SpeedTagSchema } from "./schemas/speedtag.schema";
import { SpeedController } from "./speed.controller";
import { SpeedService } from "./speed.service";
import { UserModule } from "src/user/user.module";
import { ReportModule } from "src/report/report.module";
import { WarningModule } from "src/warning/warning.module";

@Module({
    imports: [forwardRef(() => ReportModule),WarningModule,forwardRef(() => UserModule),MongooseModule.forFeature([{ name: Speed.name, schema: SpeedSchema },{ name: SpeedTag.name, schema: SpeedTagSchema }])],
    controllers: [SpeedController],
    providers: [SpeedService],

    exports: [SpeedService,MongooseModule.forFeature([{ name: Speed.name, schema: SpeedSchema }])],
})
export class SpeedModule {}