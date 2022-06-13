
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PointModule } from '../point/point.module';
import { RateLimiterModule,RateLimiterGuard } from "nestjs-rate-limiter";
import { APP_GUARD } from "@nestjs/core";
// forwardRef 防止circular引用
@Module({
    imports: [RateLimiterModule,forwardRef(() => PointModule),MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UserController],
    providers: [UserService,{
        provide: APP_GUARD,
        useClass: RateLimiterGuard,
    },],
    exports: [UserService,MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
})
export class UserModule {}