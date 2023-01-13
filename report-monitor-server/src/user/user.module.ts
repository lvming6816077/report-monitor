import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PointModule } from '../point/point.module';
import { ProjectModule } from '../project/project.module';
import { RateLimiterModule, RateLimiterInterceptor } from 'nestjs-rate-limiter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SpeedModule } from 'src/speed/speed.module';
// forwardRef 防止circular引用
@Module({
    imports: [
        RateLimiterModule.register({ type: 'Memory' }),
        forwardRef(() => PointModule),
        forwardRef(() => SpeedModule),
        forwardRef(() => ProjectModule),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
    ],
    exports: [
        UserService,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
})
export class UserModule {}
