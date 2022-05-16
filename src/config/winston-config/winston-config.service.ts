import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import {
  WinstonModuleOptionsFactory,
  WinstonModuleOptions,
} from 'nest-winston';

const { json, timestamp, combine } = winston.format;

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  createWinstonModuleOptions(): WinstonModuleOptions {
    const { NODE_ENV } = process.env;
    const transports: any[] = [];
    if (NODE_ENV === 'development') {
      transports.push(new winston.transports.Console());
    } else {
      const fileInfoTransport = new winston.transports.DailyRotateFile({
        level: 'info',
        maxSize: '5m',
        maxFiles: '14d',
        zippedArchive: true,
        datePattern: 'YYYY-MM-DD',
        filename: `log/app-info-%DATE%.log`,
      });

      const fileErrorTransport = new winston.transports.DailyRotateFile({
        level: 'error',
        maxSize: '5m',
        maxFiles: '14d',
        zippedArchive: true,
        datePattern: 'YYYY-MM-DD',
        filename: `log/app-error-%DATE%.log`,
      });
      transports.push(fileInfoTransport);
      transports.push(fileErrorTransport);
    }
    return {
      transports: transports,
      format: combine(timestamp({
          format:'YYYY-MM-DD HH:mm:ss'
      }), json()),
      defaultMeta: {
        appName: 'Report',
      },
    };
  }
}
