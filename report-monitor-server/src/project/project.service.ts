import { Injectable, Inject, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';

import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';
import { UserService } from '../user/user.service';
import { HttpException } from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import { customAlphabet } from 'nanoid';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Point, PointDocument } from 'src/point/schemas/point.schema';
import { CreateProjectDto } from './dto/create-projec.dto';
import { User } from 'src/user/schemas/user.schema';

export class ProjectService {
    constructor(
        @InjectModel(Project.name)
        private readonly projectModel: PaginateModel<ProjectDocument>,
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, // @Inject(REQUEST) private readonly req: CURUSER
    ) {}

    async createProject(
        dto: CreateProjectDto,
        userId: string,
    ): Promise<Project> {
        const nanoid = customAlphabet('12345asjqw', 10);
        const projectCode = nanoid();
        const p = await this.projectModel.create({
            name: dto.name,
            desc: dto.desc,
            type: dto.type,
            host:dto.host,
            createBy:userId,
            projectCode,
        });
        // console.log(p)
        return this.bindProject(userId, p._id);
    }

    async bindProject(uid: string, pid: string): Promise<Project> {
        pid = pid.toString()
        const p = await this.projectModel.findById(pid);
        const usersid = p.usersid || [];
        if (usersid.indexOf(uid) > -1) {
        } else {
            usersid.push(uid);
        }

        await this.projectModel
            .findOneAndUpdate({ _id: pid }, { usersid })
            .exec();
        const u = await this.userService.findUserByUserId(uid);
        const projectsid = (u.projectsid || []).map(i=>i.toString())
        if (projectsid.indexOf(pid) > -1) {
        } else {
            projectsid.push(pid);
        }
        await this.userService.updateUser(uid, { projectsid, activePid:pid});

        return await this.projectModel.findById(pid);
    }
    async unBindProject(uid: string, pid: string): Promise<User> {
        pid = pid.toString()
        const p = await this.projectModel.findById(pid);

        const usersid = p.usersid || [];
        if (usersid.indexOf(uid) > -1) {
            usersid.splice(usersid.indexOf(uid),1)
        }
        

        await this.projectModel
            .findOneAndUpdate({ _id: pid }, { usersid })
            .exec();
        const u = await this.userService.findUserByUserId(uid);

        const projectsid = (u.projectsid || []).map(i=>i.toString())

        if (projectsid.indexOf(pid) > -1) {
            projectsid.splice(projectsid.indexOf(pid),1)
        }


        
        return await this.userService.updateUser(uid, { projectsid:projectsid});

    }

    async findProjectById(pid: string): Promise<ProjectDocument> {
        return await this.projectModel.findById(pid);
    }
    async findProjectByCode(code: string): Promise<ProjectDocument> {
        return await this.projectModel.findOne({ projectCode: code });
    }

    async findAllByPage(
        pageStart = '1',
        pageSize = '10',
    ): Promise<PaginateResult<ProjectDocument>> {
        const options = {
            page: Number(pageStart),
            limit: Number(pageSize),
        };
        const q: any = {};

        const result = await this.projectModel.paginate(q, options);

        return result;
    }

    async updateProject(
        projectid: string,
        projectDto: CreateProjectDto,
    ): Promise<Project> {
        return await this.projectModel
            .findOneAndUpdate({ _id: projectid }, projectDto)
            .exec();
    }
}
