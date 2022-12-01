import { Body, Controller, Query, Get, Param, Post, Request, HttpException, UseGuards, Req } from '@nestjs/common';
import { ProjectService,  } from './project.service';
import { formatData } from 'src/utils/report/formatReportData'

import * as moment from 'moment'
import { Request as _Request } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';
import { CreateProjectDto } from './dto/create-projec.dto';


@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,

    ) { }

    @Post('create')
    async create(@Body() body: CreateProjectDto, @Request() req: any) {
        const userid = req.user.userId

        return await this.projectService.createProject(body,userid)

    }


}