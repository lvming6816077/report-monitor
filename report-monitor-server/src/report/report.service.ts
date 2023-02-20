import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { PointService } from '../point/point.service';
import { HttpException } from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import { RedisInstanceService } from 'src/config/redis-config/redis.service';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Point, PointDocument } from 'src/point/schemas/point.schema';
import { Speed, SpeedDocument } from 'src/speed/schemas/speed.schema';
import { QueryPageDto } from 'src/utils/dto/query-page.dto';
import { QueryReportDto } from './dto/query-report.dto';
const parser = require('ua-parser-js');
const searcher = require('node-ip2region').create();

export type resultVo = {
    list?: Report[];
    desc?: string;
};
@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name)
        private readonly reportModel: PaginateModel<ReportDocument>,
        @InjectModel(Point.name)
        private readonly pointModel: Model<PointDocument>,
        @InjectModel(Speed.name)
        private readonly speedModel: Model<SpeedDocument>,
        // private readonly pointService: PointService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private redisService: RedisInstanceService,
    ) {}

    async findOne(id: string): Promise<Report> {
        return this.reportModel.findOne({ _id: id }).exec();
    }

    async findAll(): Promise<Report[]> {
        return this.reportModel.find({}).exec();
    }

    async deleteManyByPoint(pointid: string): Promise<DeleteResult> {
        return this.reportModel.deleteMany({ point: pointid }).exec();
    }
    async deleteManyBySpeed(speedid: string): Promise<DeleteResult> {
        return this.reportModel.deleteMany({ speed: speedid }).exec();
    }

    async findAllReportByPointByPage(
        pageStart = '1',
        pageSize = '10',
        query: QueryReportDto,
    ): Promise<PaginateResult<ReportDocument>> {
        const data: Point = await this.pointModel.findOne({ code: query.pointCode });
        if (!data) return null
        const options = {
            page: Number(pageStart),
            limit: Number(pageSize),
            sort: {
                create: -1,
            },
            
        };
        const q: any = { point: data._id,
            $and: [
                { create: { $gt: new Date(query.timeStart) } },
                { create: { $lt: new Date(query.timeEnd) } },
            ],
         };
        // if (query.desc) {
        //     q.desc = { $regex: query.desc, $options: 'i' };
        // }

        return await this.reportModel.paginate(q, options);
    }

    async findAllReportGroupByIp(
        query: any,
    ): Promise<Report[]> {
        const data: Point = await this.pointModel.findOne({ code: query.pointCode });

        if (!data) return null


        const result = await this.reportModel
         .aggregate([
             {
                 $match: {
                     $and: [
                         { point: (data as any)._id },
                         { create: { $gt: new Date(query.timeStart) } },
                         { create: { $lt: new Date(query.timeEnd) } },
                     ],
                 },
             },
             { $group: { _id: '$ip', count: { $sum: 1 } } },
         ])
         .exec();

        return result
    }

    // mongoose聚合：https://wohugb.gitbooks.io/mongoose/content/aggregation_group.html
    async findAllByCode(
        code: string,
        start: string,
        end: string,
        unit: number,
    ): Promise<resultVo> {
        const data: Point = await this.pointModel.findOne({ code: code });

        // let r = await this.reportModel.find({$and: [{ point: (data as any)._id }, { create: { $gt: new Date(start) } }, { create: { $lt: new Date(end) } }]}).exec()

        if (data) {
            const result = await this.reportModel
                .aggregate([
                    {
                        $match: {
                            $and: [
                                { point: (data as any)._id },
                                { create: { $gt: new Date(start) } },
                                { create: { $lt: new Date(end) } },
                            ],
                        },
                    },
                    {
                        $project: {
                            dateStr: {
                                year: { $year: '$create' },
                                month: { $month: '$create' },
                                day: {
                                    $dayOfMonth: {
                                        date: '$create',
                                        timezone: '+08:00',
                                    },
                                },
                                hour: {
                                    $hour: {
                                        date: '$create',
                                        timezone: '+08:00',
                                    },
                                },
                                minute: {
                                    $subtract: [
                                        { $minute: '$create' },
                                        {
                                            $mod: [
                                                { $minute: '$create' },
                                                unit,
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    { $group: { _id: '$dateStr', count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                ])
                .exec();
            return {
                list: result,
                desc: data.desc,
            };
        }
        return {
            list: [],
            desc: null,
        };
    }

    async findAllSpeedByCode(
        code: string,
        start: string,
        end: string,
        unit: number,
    ): Promise<resultVo> {
        const data: Speed = await this.speedModel.findOne({ code: code });

        // let r = await this.reportModel.find({$and: [{ point: (data as any)._id }, { create: { $gt: new Date(start) } }, { create: { $lt: new Date(end) } }]}).exec()

        if (data) {
            const result = await this.reportModel
                .aggregate([
                    {
                        $match: {
                            $and: [
                                { speed: (data as any)._id },
                                { create: { $gt: new Date(start) } },
                                { create: { $lt: new Date(end) } },
                            ],
                        },
                    },
                    {
                        //根据project表达式指定输入的字段或者计算的字段，语法如下：
                        $project: {
                            dateStr: {
                                year: { $year: '$create' },
                                month: { $month: '$create' },
                                day: {
                                    $dayOfMonth: {
                                        date: '$create',
                                        timezone: '+08:00',
                                    },
                                },
                                hour: {
                                    $hour: {
                                        date: '$create',
                                        timezone: '+08:00',
                                    },
                                },
                                minute: {
                                    $subtract: [
                                        { $minute: '$create' },
                                        {
                                            $mod: [
                                                { $minute: '$create' },
                                                unit,
                                            ],
                                        },
                                    ],
                                },
                            },
                            d: 1,
                        },
                    },
                    { $group: { _id: '$dateStr', avg_value: { $avg: '$d' } } },
                    { $sort: { _id: 1 } },
                ])
                .exec();
            console.log(result);
            return {
                list: result,
                desc: data.desc,
            };
        }
        return {
            list: [],
            desc: null,
        };
    }

    async create(code: string,ip:string,ua:string,referer:string,meta?:any): Promise<Report> {
        await this.redisService.lpush(
            'report_monitor_ls',
            JSON.stringify({
                code: code,
                ip:ip,
                ua,
                meta,
                referer,
                create: new Date(),
            }),
        );
        return 'success' as any;
    }
    async createSpeed(code: string, d: number): Promise<Report> {
        await this.redisService.lpush(
            'speed_monitor_ls',
            JSON.stringify({
                code: code,
                d: d,
                create: new Date(),
            }),
        );
        return 'success' as any;
    }
    async createByTask(): Promise<any> {
        // 数据点统计数据
        try {
            let n = 10000; // 每次定时任务最大次数
            while (n > 0) {
                let res = await this.redisService.rpop('report_monitor_ls');

                if (res == null) break;
                res = JSON.parse(res);
                this.createItem(res.code, res.create, res.ip,res.ua,res.referer,res.meta);
                n--;
            }
        } catch (e) {
            this.logger.error(e, {
                context: ReportService.name,
            });
        }
        // 测速数据
        try {
            let n = 10000; // 每次定时任务最大次数
            while (n > 0) {
                let res = await this.redisService.rpop('speed_monitor_ls');

                if (res == null) break;
                res = JSON.parse(res);
                this.createSpeedItem(res.code, res.d, res.create);
                n--;
            }
        } catch (e) {
            this.logger.error(e, {
                context: ReportService.name,
            });
        }
    }

    private async createItem(code: string, date: Date, ip:string,ua:string,referer:string,meta:any): Promise<Report> {
        const data: Point = await this.pointModel.findOne({ code: code });

        if (data) {
            if (data.isBlock) return;
            var reg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
            let city = null
            let province = null
            let browser = null
            let os = null
            // console.log(ip)
            if (reg.test(ip)) {
                let regObj = searcher.btreeSearchSync(ip)
                city = regObj.region.split('|')[3]
                province = regObj.region.split('|')[2]
            }

            var o = parser(ua);
            if (o) {
                browser = o.browser.name
                os = o.os.name
            }

            const item = await this.reportModel.create({
                point: (data as any)._id,
                create: date,
                city,
                province,
                ip,
                browser,
                os,
                meta,
                referer,
                ua
            });

            return item;
        }
        this.logger.error('point.code不存在:' + code, {
            context: ReportService.name,
        });
    }

    private async createSpeedItem(
        code: string,
        d: number,
        date: Date,
    ): Promise<Report> {
        const data: Speed = await this.speedModel.findOne({ code: code });

        if (data) {
            if (data.isBlock) return;
            const item = await this.reportModel.create({
                speed: (data as any)._id,
                d: d,
                create: date,
            });

            return item;
        }
        this.logger.error('speed.code不存在:' + code, {
            context: ReportService.name,
        });
    }

    /*async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
        return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
    }*/
}
