
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Point, PointSchema } from "./schemas/point.schema";
import { PointController } from "./point.controller";
import { PointService } from "./point.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Point.name, schema: PointSchema }])],
    controllers: [PointController],
    providers: [PointService],

    exports: [PointService],
})
export class PointModule {}