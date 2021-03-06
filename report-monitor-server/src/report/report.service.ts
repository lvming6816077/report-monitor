import { Injectable,Inject } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { Model } from 'mongoose';
import { PointService } from '../point/point.service';
import { HttpException } from '@nestjs/common';
import { DeleteResult } from "mongodb";
import { RedisInstanceService } from "src/config/redis-config/redis.service";

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';
import { Point,PointDocument } from "src/point/schemas/point.schema";
export type resultVo = {
    list?:Report[],
    desc?:string
};
@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>, 
        @InjectModel(Point.name) private readonly pointModel: Model<PointDocument>,
        // private readonly pointService: PointService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private redisService: RedisInstanceService) { 

        }

    async findOne(id: string): Promise<Report> {
        return this.reportModel.findOne({ _id: id }).exec();
    }

    async findAll(): Promise<Report[]> {
        return this.reportModel.find({}).exec();
    }

    async deleteOneByPoint(pointid:string):Promise<DeleteResult> {
        return this.reportModel.deleteMany({ point: pointid }).exec();
    }


    async findAllByCode(code: string, start: string, end: string,unit:number): Promise<resultVo> {
        const data: Point = await this.pointModel.findOne({code:code});

        // let r = await this.reportModel.find({$and: [{ point: (data as any)._id }, { create: { $gt: new Date(start) } }, { create: { $lt: new Date(end) } }]}).exec()

        if (data) {
            const result = await this.reportModel.aggregate([
                {
                    $match: {
                        $and: [{ point: (data as any)._id }, { create: { $gt: new Date(start) } }, { create: { $lt: new Date(end) } }]
                    }
                },
                {
                    "$project":
                    {
                        "dateStr": {
                            "year": { "$year": "$create" },
                            "month": { "$month": "$create" },
                            "day": { "$dayOfMonth": {"date":"$create","timezone": "+08:00" } },
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
            return {
                list: result,
                desc:data.desc
            }
        }
        return {
            list: [],
            desc:null
        }
    }

    async create(code: string): Promise<Report> {

        await this.redisService.lpush('report_monitor_ls', JSON.stringify({
            code:code,
            create:new Date()
        }));
        return 'success' as any

    }
    async createByTask(): Promise<any> {

        try {
            let n = 10000// ??????????????????????????????
            while(n > 0){
                let res = await this.redisService.rpop('report_monitor_ls')

                if (res == null) break
                res = JSON.parse(res)
                this.createItem(res.code,res.create)
                n--
            }
        }catch(e){
            this.logger.error(e,{
                context: ReportService.name,
            })
        }
    }

    private async createItem(code: string,date:Date): Promise<Report> {

        const data: Point = await this.pointModel.findOne({code:code});
        
        if (data) {
            if (data.isBlock) return 
            const item = await this.reportModel.create({
                point: (data as any)._id,
                create:date
            })

            return item
        }
        this.logger.error('point.code?????????:'+code,{
            context: ReportService.name,
        })

    }



    /*async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
        return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
    }*/
}