
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Point, PointSchema } from "./schemas/point.schema";
import { Tag, TagSchema } from "./schemas/tag.schema";
import { PointController } from "./point.controller";
import { PointService } from "./point.service";
import { UserModule } from "src/user/user.module";
import { ReportModule } from "src/report/report.module";

@Module({
    imports: [forwardRef(() => ReportModule),UserModule,MongooseModule.forFeature([{ name: Point.name, schema: PointSchema },{ name: Tag.name, schema: TagSchema }])],
    controllers: [PointController],
    providers: [PointService],

    exports: [PointService,MongooseModule.forFeature([{ name: Point.name, schema: PointSchema }])],
})
export class PointModule {}