import { Body, Controller, Query, Get, Param, Post, Request, HttpException, UseGuards } from '@nestjs/common';
import { ProjectService,  } from './project.service';
import { formatData } from 'src/utils/report/formatReportData'

import * as moment from 'moment'
import { Request as _Request } from 'express';
import { PointService } from 'src/point/point.service';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';



@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,

        private readonly pointService: PointService,
    ) { }




}