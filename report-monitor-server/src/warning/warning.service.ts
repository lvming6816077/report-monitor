import { forwardRef, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';


import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';
import { customAlphabet } from 'nanoid'
import { DeleteResult } from "mongodb";

import { REQUEST } from "@nestjs/core";
import { UserService } from "src/user/user.service";
import { ReportService } from "src/report/report.service";
import { Warning, WarningDocument } from "./schemas/warning.schema";
import { CreateWarningDto } from "./dto/create-warning.dto";


export class WarningService {

    constructor(
        @InjectModel(Warning.name) 
        private readonly warningModel: PaginateModel<WarningDocument>,
        

        @Inject(forwardRef(() => ReportService))
        private readonly reportService: ReportService,

        ) { }

    
    async create(dto: CreateWarningDto): Promise<Warning> {
        // 1对1关系，所以要先清空
        await this.warningModel.deleteMany({point:dto.pointId}).exec()
        return await this.warningModel.create({
            ...dto,
            point: dto.pointId,
        })
    }

    async findByPoint(point:string): Promise<Warning> {
        return await this.warningModel.findOne({
            point: point,
        })
    }

    async findById(id:string): Promise<Warning> {
        return await this.warningModel.findById(id).exec()
    }

    async findAllOpened(): Promise<WarningDocument[]> {
        return await this.warningModel.find({
            isOpen: true,
        }).populate('point').exec()
    }

    async updateWarningTrigger(id:string,num?:number): Promise<WarningDocument> {

        const r = await this.warningModel.findById(id).exec()

        return await this.warningModel.findOneAndUpdate({_id:id},{
            triggerCount: num !== undefined ? num : r.triggerCount+1,
        })

    }


}