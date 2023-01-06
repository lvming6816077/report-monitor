import { Injectable,Inject, Scope } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/log.schema';

import { PointService } from '../point/point.service';
import { HttpException } from '@nestjs/common';
import { DeleteResult } from "mongodb";
import { RedisInstanceService } from "src/config/redis-config/redis.service";
import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';
import { Point,PointDocument } from "src/point/schemas/point.schema";
import * as moment from 'moment'

export type resultVo = {
    list?:Log[],
    desc?:string
};


export class LogService {
    constructor(
        @InjectModel(Log.name) private readonly logModel: PaginateModel<LogDocument>, 
        // private readonly pointService: PointService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

        // @Inject(REQUEST) private readonly req: CURUSER
        ) { 

        }


        async create(str: string,ua:string,ip:string,meta:any,pid:string): Promise<Log> {
            return await this.logModel.create({ str: str,project:pid,ua,ip ,meta});
        }

        async findAllByTagId(pid:string): Promise<Log[]> {
            let list = await this.logModel.find({ project:pid }).exec();
    
            return list||[]
        }

        async findAllByPage(pageStart:string='1', pageSize: string='10', query): Promise<PaginateResult<LogDocument>> {
            const options = {
                page: Number(pageStart),
                limit: Number(pageSize),
                sort: {
                    create: -1
                },
                
            };

            const q: any = { project: query.projectId }
            
            if (query.keyword) {
                q.str = { $regex: query.keyword, $options: 'i' }
            }
            if (query.timeStart) {
                q.$and = [{ create: { $gt: new Date(query.timeStart) } }, { create: { $lt: new Date(query.timeEnd) } }]
            }

            const result = await this.logModel.paginate(q,options)
    
            return result
        }

        
        async deleteLogTask() {
            var end = moment().valueOf()
            var start = moment().subtract(7, 'days').valueOf()

            await this.logModel.deleteMany({$and :[{ create: { $gt: new Date(start) } }, { create: { $lt: new Date(end) } }]})
    
        }

}