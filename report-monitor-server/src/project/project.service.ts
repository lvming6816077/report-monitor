import { Injectable,Inject, Scope } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';

import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';
import { UserService } from '../user/user.service';
import { HttpException } from '@nestjs/common';
import { DeleteResult } from "mongodb";
import { customAlphabet } from 'nanoid'

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';
import { Point,PointDocument } from "src/point/schemas/point.schema";
import { CreateProjectDto } from "./dto/create-projec.dto";




export class ProjectService {
    constructor(
        @InjectModel(Project.name) private readonly projectModel: PaginateModel<ProjectDocument>, 
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

        // @Inject(REQUEST) private readonly req: CURUSER
        ) { 

        }


        async createProject(dto:CreateProjectDto,userId:string): Promise<Project> {
            const nanoid = customAlphabet('12345asjqw', 10)
            var projectCode = nanoid()
            const p = await this.projectModel.create({ name:dto.name,desc:dto.desc,type:dto.type,projectCode});
            // console.log(p)
            return this.bindProject(userId,p._id)
        }

        async bindProject(uid:string,pid:string): Promise<Project> {
            const p = await this.projectModel.findById(pid);
            let usersid = p.usersid||[]
            if (usersid.indexOf(uid) > -1) {
                
            } else {
                usersid.push(uid)
            }

            await this.projectModel.findOneAndUpdate({_id:pid},{usersid}).exec()
            const u = await this.userService.findUserByUserId(uid)
            let projectsid = u.projectsid||[]
            if (projectsid.indexOf(pid) > -1) {

            } else {
                projectsid.push(pid)
            }
            await this.userService.updateUser(uid,{projectsid,activePid:pid})

            return await this.projectModel.findById(pid);
        }

        async findProjectById(pid:string): Promise<ProjectDocument> {

            return await this.projectModel.findById(pid);
        }

        async findAllByPage(pageStart:string='1', pageSize: string='10'): Promise<PaginateResult<ProjectDocument>> {
            const options = {
                page: Number(pageStart),
                limit: Number(pageSize),
            };
            const q:any = {}

            const result = await this.projectModel.paginate(q,options)
    
            return result
        }


}