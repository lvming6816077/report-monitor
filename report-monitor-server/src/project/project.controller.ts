import {
    Body,
    Controller,
    Query,
    Get,
    Param,
    Post,
    Request,
    HttpException,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { formatData } from 'src/utils/report/formatReportData';

import * as moment from 'moment';
import { Request as _Request } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';
import { CreateProjectDto } from './dto/create-projec.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import mongoose,{ClientSession} from 'mongoose';

@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService,
        private readonly userService: UserService) {}

    @Post('create')
    async create(@Body() body: CreateProjectDto, @Request() req: any) {
        const userid = req.user.userId;

        return await this.projectService.createProject(body, userid);
    }

    @Post('bind')
    async bind(@Body() body: any, @Request() req: any) {
        const userid = req.user.userId;

        const p = await this.projectService.findProjectByCode(body.code);

        if (!p._id) {
            throw new HttpException('项目不存在', 200);
        }

        const res = await this.projectService.bindProject(userid, p._id);


        await this.userService.updateUser(userid, {
            activePid: p._id,
        });

 
        return p._id
    }

    @Post('unbind')
    async unbind(@Body() body: any, @Request() req: any) {
        const userid = req.user.userId;

        const p = await this.projectService.findProjectByCode(body.code);

        if (!p._id) {
            throw new HttpException('项目不存在', 200);
        }

        await this.projectService.unBindProject(userid, p._id);
        const res = await this.userService.findUserByUserId(userid)
        // console.log(res)
        if (res.projectsid[0]) {
            await this.userService.updateUser(userid, {
                activePid: res.projectsid[0],
            });
        }

        
        return res.projectsid[0]
    }

    @Post('deleteProject')
    async deleteProject(@Body() body: any, @Request() req: any) {

        // const session = await mongoose.connection.startSession()

        // session.startTransaction()
        const session = null

        try {

        
            await this.projectService.deleteProjectById(body.id,session)


    
            let list = await this.userService.findAllUser()

            for (var i = 0 ; i < list.length ; i++) {
                await this.projectService.unBindProject(list[i].userid,body.id,session)
            }
            
            // await session.commitTransaction()
        }catch(r){

        }finally{
            // session.endSession()
        }

        return 'success'

    }

    @Get('getProjectsList')
    async getProjectsList(@Query() query: QueryProjectDto) {
        const result = await this.projectService.findAllByPage(
            query.pageStart,
            query.pageSize,
        );
        var arr = []
        for (var i = 0 ; i < result.docs.length ; i++) {
            const k = result.docs[i].toJSON();
            const u = await this.userService.findUserByUserId(k.createBy as unknown as string)
            arr.push({
                ...k,
                u
            })
        }

        return {
            ...result,
            docs: arr,
        };
    }

    @Get('getProjectDetail')
    async getProjectDetail(@Query() query) {
        return this.projectService.findProjectById(query.id)
    }

    @UseGuards(JwtAuthGuard)
    @Post('update')
    async update(@Body() body: CreateProjectDto, @Req() req) {
        const u = await this.projectService.updateProject(body.projectid, body);
        if (u.projectCode) {
            return 'success';
        }

        return 'error';
    }
}
