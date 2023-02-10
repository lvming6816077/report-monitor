import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Point, PointDocument } from './schemas/point.schema';

import { Tag, TagDocument } from './schemas/tag.schema';
import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { DeleteResult } from 'mongodb';
import { CreateTagDto } from './dto/create-tag.dto';

import { REQUEST } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { QueryPointDto } from './dto/query-point.dto';
import { ReportService } from 'src/report/report.service';
import { WarningService } from 'src/warning/warning.service';
import { setDefaultResultOrder } from 'dns';
import { CreatePointDto } from './dto/create-point.dto';
import { QueryTagDto } from './dto/query-tag.dto';
import { QueryReportDto } from 'src/report/dto/query-report.dto';

export type CURUSER = {
    user: {
        userId: string;
    };
};

@Injectable({ scope: Scope.REQUEST })
export class PointService {
    constructor(
        @InjectModel(Point.name)
        private readonly pointModel: PaginateModel<PointDocument>,

        @InjectModel(Tag.name)
        private readonly tagModel: PaginateModel<TagDocument>,

        @Inject(forwardRef(() => ReportService))
        private readonly reportService: ReportService,

        private readonly warningService: WarningService,

        private readonly userService: UserService,

        @Inject(REQUEST) private readonly req: CURUSER,
    ) {}

    async findOne(id: string): Promise<Point> {
        return this.pointModel.findOne({ _id: id }).exec();
    }

    async findAll(projectId: string): Promise<any[]> {
        const list = await this.tagModel.find({ project: projectId }).exec();

        const result = [];
        for (let i = 0; i < list.length; i++) {
            const children = this.pointModel.find({ tag: list[i]._id }).exec();
            const o = {
                title: list[i].desc,
                key: list[i]._id,
                value: list[i]._id,
                children: (await children).map((k) => {
                    return {
                        title: k.desc + '(' + k.code + ')',
                        key: k.code,
                        value: k.code,
                        desc: k.desc,
                    };
                }),
            };
            result.push(o);
        }
        return result;
    }
    async findAllByPage(
        pageStart = '1',
        pageSize = '10',
        query: QueryPointDto,
        isAll = false,
    ): Promise<PaginateResult<PointDocument>> {
        const options = {
            populate: ['tag'],
            page: Number(pageStart),
            limit: Number(pageSize),
        };
        const q: any = isAll ? {} : { project: query.projectId };
        if (query.desc) {
            q.desc = { $regex: query.desc, $options: 'i' };
        }
        if (query.code) {
            q.code = { $regex: query.code, $options: 'i' };
        }
        const result = await this.pointModel.paginate(q, options);

        const l = [];
        for (let i = 0; i < result.docs.length; i++) {
            const k = result.docs[i].toJSON();
            const warning = await this.warningService.findByPoint(k._id);
            const user = await this.userService.findUserByUserId(
                k.user as unknown as string,
            );
            const o = {
                ...k,
                warning,
                user,
            };
            l.push(o);
        }

        return {
            ...result,
            docs: l,
        };
    }
    async findAllAdminByPage(
        pageStart = '1',
        pageSize = '10',
        query: QueryPointDto,
    ): Promise<PaginateResult<PointDocument>> {
        return await this.findAllByPage(pageStart, pageSize, query, true);
    }

    async findAllTagByPage(
        pageStart = '1',
        pageSize = '10',
        query: QueryTagDto,
    ): Promise<PaginateResult<TagDocument>> {
        const options = {
            page: Number(pageStart),
            limit: Number(pageSize),
        };
        const q: any = { project: query.projectId };
        if (query.desc) {
            q.desc = { $regex: query.desc, $options: 'i' };
        }

        const result = await this.tagModel.paginate(q, options);
        return result;
    }

    async findOneByCode(code: string): Promise<Point> {
        return this.pointModel.findOne({ code: code }).exec();
    }

    async createTag(desc: string, projectId: string): Promise<Tag> {
        const nanoid = customAlphabet('123456789', 4);
        const code = nanoid(); // 随机且唯一code
        return await this.tagModel.create({
            desc: desc,
            user: this.req.user.userId,
            code,
            project: projectId,
        });
    }

    async create(dto: CreatePointDto): Promise<Point> {
        const nanoid = customAlphabet('123456789', 6);
        const code = nanoid(); // 随机且唯一code
        return await this.pointModel.create({
            code,
            project: dto.projectId,
            user: this.req.user.userId,
            tag: dto.tagId,
            desc: dto.desc,
        });
    }
    async findAllTags(query: QueryTagDto): Promise<Tag[]> {
        const list = await this.tagModel
            .find({ project: query.projectId })
            .exec();

        return list;
    }

    async findOneTagByCode(code: string): Promise<Tag> {
        return this.tagModel.findOne({ code: code }).exec();
    }

    async deleteById(id: string): Promise<DeleteResult> {
        // 删除关联的report
        await this.reportService.deleteOneByPoint(id);

        // 删除关联的waring
        await this.warningService.deleteByPoint(id);

        return await this.pointModel.deleteOne({ _id: id }).exec();
    }
    async deleteTagById(id: string): Promise<DeleteResult> {
        // 删除关联的point
        await this.pointModel.deleteMany({ tag: id });

        return this.tagModel.deleteOne({ _id: id }).exec();
    }
    async updatePoint(id: string, dto): Promise<Point> {
        // console.log(dto)
        return await this.pointModel.findOneAndUpdate({ _id: id }, dto).exec();
    }

    
    /*async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
        return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
    }*/
}
