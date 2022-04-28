import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './winston-config/winston-config.service';
// import { JwtConfigService } from './jwt-config/jwt-config.service';
// import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from 'src/constants';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from 'src/config/jwt-config/jwt.strategy';
// import { ConfigModule as LoadEnvModule } from '@nestjs/config';
import { join } from 'path';
// import { TypeOrmConfigService } from 'src/config/typeorm-config/typeorm-config.service';
// import { TypeOrmModule } from '@nestjs/typeorm';

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
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '10h' },
    // }),
  ],
  providers: [/*JwtStrategy, JwtConfigService, */WinstonConfigService],
  exports: [/*JwtConfigService,*/ WinstonConfigService],
})
export class ConfigModule {}
