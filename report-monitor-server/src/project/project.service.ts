import { Injectable,Inject, Scope } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Model } from 'mongoose';
import { PointService } from '../point/point.service';
import { HttpException } from '@nestjs/common';
import { DeleteResult } from "mongodb";

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';
import { Point,PointDocument } from "src/point/schemas/point.schema";




export class ProjectService {
    constructor(
        @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>, 
        // private readonly pointService: PointService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

        // @Inject(REQUEST) private readonly req: CURUSER
        ) { 

        }





}