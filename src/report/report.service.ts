import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { Model } from 'mongoose';
import { PointService } from '../point/point.service';
import { HttpException } from '@nestjs/common';


@Injectable()
export class ReportService {
    constructor(@InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>,private readonly pointService: PointService) {}

    async findOne(id: string): Promise<Report> {
        return this.reportModel.findOne({ _id:id }).exec();
    }

    async findAll(): Promise<Report[]> {
        return this.reportModel.find({}).exec();
    }
    async findAllByCode(code:string,start:string,end:string): Promise<Report[]> {
        const data:any[] = await this.pointService.findOneByCode(code)
        if (data.length) {
            return await this.reportModel.aggregate([
                { 
                    $match: {
                        $and: [{point:data[0]._id},{ create: { $gt: new Date(start) } }, { create: { $lt: new Date(end) } }]
                    }
                },
                {
                    $project: {
                        date1Str: {$dateToString: {format: "%Y-%m-%d %H:%M", date:"$create",timezone:"+08:00"}},
                        // date2Str: {$dateToString: {format: "%Y-%m-%d %H:%M:%S:%L", date:{"$add":[new Date(0),"$create",28800000]}}}
                        // dt:{$dateToString:{format:"%Y-%m-%d",date:{$add:[ISODate("1970-01-01T00:00:00Z"),{$multiply:["$create_time",1000]}]}}}
                    }
                },
                {$group: {_id: "$date1Str", total: {$sum: 1}}},
                {$sort:{_id:1}}
            ]).exec()
        }
        throw new HttpException('point.code不存在', 500);
    }

    async create(code: string): Promise<Report> {
        const data:any = await this.pointService.findOneByCode(code)

        if (data.length) {
            return await this.reportModel.create({
                point:data[0]._id,
            })
        }

        throw new HttpException('point.code不存在', 500);
        
    }

    /*async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
        return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
    }*/
}