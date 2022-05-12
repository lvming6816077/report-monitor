import { Injectable,Inject } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { Model } from 'mongoose';
import { PointService } from '../point/point.service';
import { HttpException } from '@nestjs/common';
import { RedisInstanceService } from "src/config/redis-config/redis.service";

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>, 
        private readonly pointService: PointService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private redisService: RedisInstanceService) { 

        }

    async findOne(id: string): Promise<Report> {
        return this.reportModel.findOne({ _id: id }).exec();
    }

    async findAll(): Promise<Report[]> {
        return this.reportModel.find({}).exec();
    }
    async findAllByCode(code: string, start: string, end: string,unit:number): Promise<Report[]> {
        const data: any[] = await this.pointService.findOneByCode(code)
        if (data.length) {
            // const result = []
            const result = await this.reportModel.aggregate([
                {
                    $match: {
                        $and: [{ point: data[0]._id }, { create: { $gt: new Date(start) } }, { create: { $lt: new Date(end) } }]
                    }
                },
                {
                    "$project":
                    {
                        "dateStr": {
                            "year": { "$year": "$create" },
                            "month": { "$month": "$create" },
                            "day": { "$dayOfMonth": "$create" },
                            "hour": { "$hour": {"date":"$create","timezone": "+08:00" }},
                            "minute": {
                                "$subtract": [
                                    { "$minute": "$create" },
                                    { "$mod": [{ "$minute": "$create" }, unit] }
                                ]
                            }
                        }
                    }
                },
                { "$group": { "_id": "$dateStr", "count": { "$sum": 1 } } },
                { $sort: { "_id": 1 } }
            ]).exec()

            return result.map(o=>{
                return {
                    ...o,
                    desc:data[0].desc
                }
            })
        }
        throw new HttpException('point.code不存在', 500);
    }

    async create(code: string): Promise<Report> {

        await this.redisService.lpush('report_monitor_ls', JSON.stringify({
            code:code,
            create:new Date()
        }));
        return 'success' as any

    }
    async createByTask(code: string,date:Date): Promise<Report> {
        const data: any = await this.pointService.findOneByCode(code)

        if (data.length) {
            return await this.reportModel.create({
                point: data[0]._id,
                create:date
            })
        }
        this.logger.error('point.code不存在:'+code)

    }

    /*async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
        return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
    }*/
}