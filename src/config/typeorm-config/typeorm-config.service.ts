// import { Injectable } from '@nestjs/common';
// import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { join } from 'path';
// import * as pkg from '../../../package.json';

// @Injectable()
// export class TypeOrmConfigService implements TypeOrmOptionsFactory {
//   constructor(private readonly configService: ConfigService) {}

//   createTypeOrmOptions(
//     connectionName?: string,
//   ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
//     return {
//       type: 'mysql',
//       timezone: '+08:00',
//       name: connectionName || pkg.name,
//       host: this.configService.get('DB_HOST'),
//       port: Number(this.configService.get('DB_PORT')),
//       username: this.configService.get('DB_USERNAME'),
//       password: this.configService.get('DB_PASSWORD'),
//       database: this.configService.get('DB_NAME'),
//       synchronize: this.configService.get('DB_TYPEORM_SYNC') === 'true',
//       logging: this.configService.get('DB_TYPEORM_LOG') === 'true',
//       entities: [join(__dirname, '../../entities/*.entity.{ts,js}')],
//     };
//   }
// }
