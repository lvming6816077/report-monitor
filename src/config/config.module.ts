import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './winston-config/winston-config.service';
import { RedisInstanceService } from './redis-config/redis.service';
// import { JwtConfigService } from './jwt-config/jwt-config.service';
// import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from 'src/constants';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from 'src/config/jwt-config/jwt.strategy';
// import { ConfigModule as LoadEnvModule } from '@nestjs/config';
import { join } from 'path';
// import { TypeOrmConfigService } from 'src/config/typeorm-config/typeorm-config.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule} from 'nestjs-redis'
@Global()
@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   useClass: TypeOrmConfigService,
    // }),
    // LoadEnvModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: [
    //     join(
    //       __dirname,
    //       '..',
    //       `../../env/.${process.env.NODE_ENV || 'development'}.env`,
    //     ),
    //   ],
    // }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    RedisModule.register({
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 0
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '10h' },
    // }),
  ],
  providers: [/*JwtStrategy, JwtConfigService, */WinstonConfigService,RedisInstanceService],
  exports: [/*JwtConfigService,*/ WinstonConfigService,RedisInstanceService],
})
export class ConfigModule {}
