import { Injectable,Inject } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { Model } from 'mongoose';
import { PointService } from '../point/point.service';
import { HttpException } from '@nestjs/common';
import { DeleteResult } from "mongodb";
import { RedisInstanceService } from "src/config/redis-config/redis.service";

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';
import { Point,PointDocument } from "src/point/schemas/point.schema";
export type resultVo = {
    list?:Log[],
    desc?:string
};
@Injectable()
export class LogService {
    constructor(
        @InjectModel(Log.name) private readonly logModel: Model<LogDocument>, 
        // private readonly pointService: PointService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        ) { 

        }


        async create(str: string,tid:string): Promise<Log> {
            return await this.logModel.create({ str: str,tag:tid });
        }

        async findAll(): Promise<Log[]> {
            let list = await this.logModel.find({ }).exec();
    
            return list
        }



}