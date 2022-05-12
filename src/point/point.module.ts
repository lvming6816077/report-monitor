
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Point, PointSchema } from "./schemas/point.schema";
import { Tag, TagSchema } from "./schemas/tag.schema";
import { PointController } from "./point.controller";
import { PointService } from "./point.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Point.name, schema: PointSchema },{ name: Tag.name, schema: TagSchema }])],
    controllers: [PointController],
    providers: [PointService],

    exports: [PointService],
})
export class PointModule {}