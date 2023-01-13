import { forwardRef, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';

import { Speed, SpeedDocument } from './schemas/speed.schema';

import { SpeedTag, SpeedTagDocument } from './schemas/speedtag.schema';
import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';
import { customAlphabet } from 'nanoid'
import { DeleteResult } from "mongodb";


import { REQUEST } from "@nestjs/core";
import { UserService } from "src/user/user.service";

import { ReportService } from "src/report/report.service";
import { WarningService } from "src/warning/warning.service";
import { setDefaultResultOrder } from "dns";
import { QuerySpeedTagDto } from "./dto/query-speed-tag.dto";
import { CreateSpeedDto } from "./dto/create-speed.dto";
import { QuerySpeedDto } from "./dto/query-speed.dto";


export type CURUSER = {
    user: {
        userId: string
    }
}

@Injectable({ scope: Scope.REQUEST })
export class SpeedService {

    constructor(
        @InjectModel(Speed.name) private readonly speedModel: PaginateModel<SpeedDocument>,
        
        @InjectModel(SpeedTag.name) private readonly speedTagModel: PaginateModel<SpeedTagDocument>,

        @Inject(forwardRef(() => ReportService))
        private readonly reportService: ReportService,

        private readonly warningService: WarningService,

        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,


        @Inject(REQUEST) private readonly req: CURUSER) { }


        async createTag(desc: string, projectId: string): Promise<SpeedTag> {
            const nanoid = customAlphabet('123456789', 4)
            const code = nanoid() // 随机且唯一code
            return await this.speedTagModel.create({ desc: desc, user: this.req.user.userId,code,project:projectId });
        }

        async findAllTagByPage(pageStart: string = '1', pageSize: string = '10', query: QuerySpeedTagDto): Promise<PaginateResult<SpeedTagDocument>> {
            const options = {
                page: Number(pageStart),
                limit: Number(pageSize),
            };
            const q: any = { project: query.projectId }
            if (query.desc) {
                q.desc = { $regex: query.desc, $options: 'i' }
            }
    
            const result = await this.speedTagModel.paginate(q, options)
            return result
        }

        async findAllTags(query:QuerySpeedTagDto): Promise<SpeedTag[]> {
            let list = await this.speedTagModel.find({ project: query.projectId }).exec();
    
            return list
        }

        async create(dto: CreateSpeedDto): Promise<Speed> {
            const nanoid = customAlphabet('123456789', 6)
            const code = nanoid() // 随机且唯一code
            return await this.speedModel.create({
                code,
                project:dto.projectId,
                user: this.req.user.userId,
                tag: dto.tagId,
                desc: dto.desc,
            })
        }

        async findAllByPage(pageStart: string = '1', pageSize: string = '10', query: QuerySpeedDto,isAll=false): Promise<PaginateResult<SpeedDocument>> {
            const options = {
                populate: ['tag'],
                page: Number(pageStart),
                limit: Number(pageSize),
            };
            const q: any = isAll ? {} : { project: query.projectId }
            if (query.desc) {
                q.desc = { $regex: query.desc, $options: 'i' }
            }
            if (query.code) {
                q.code = { $regex: query.code, $options: 'i' }
            }
            const result = await this.speedModel.paginate(q, options)
    
            const l = []
            for (var i = 0 ; i < result.docs.length ; i++) {
                var k = result.docs[i].toJSON()

                const user = await this.userService.findUserByUserId(k.user as unknown as string)
                var o = {
                    ...k,
                    user
                }
                l.push(o)
            }
    
            return {
                ...result,
                docs:l
            }
    
        }

        async findOneByCode(code: string): Promise<Speed> {
            return this.speedModel.findOne({ code: code }).exec();
        }

        async findAll(projectId:string): Promise<any[]> {
            let list = await this.speedTagModel.find({ project: projectId }).exec();
    
            let result = []
            for (var i = 0; i < list.length; i++) {
                let children = this.speedModel.find({ tag: list[i]._id}).exec()
                const o = {
                    title: list[i].desc,
                    key: list[i]._id,
                    value: list[i]._id,
                    children: (await children).map(k => {
                        return {
                            title: k.desc + "(" + k.code + ")",
                            key: k.code,
                            value: k.code,
                            desc: k.desc
                        }
                    })
                }
                result.push(o)
            }
            return result
        }
}