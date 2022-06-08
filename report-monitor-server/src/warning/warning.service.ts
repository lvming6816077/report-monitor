import { forwardRef, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';


import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';
import { customAlphabet } from 'nanoid'
import { DeleteResult } from "mongodb";
import { formatData } from 'src/utils/report/formatReportData'
import * as moment from 'moment'
import { ReportService, resultVo } from "src/report/report.service";
import { Warning, WarningDocument } from "./schemas/warning.schema";
import { CreateWarningDto } from "./dto/create-warning.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { makeCharts } from 'src/utils/echarts/generate'
import emailStr from 'src/config/email-config/templates/tpl'
import { UserService } from "src/user/user.service";
import { User, UserDocument } from "src/user/schemas/user.schema";


export class WarningService {

    constructor(
        @InjectModel(Warning.name)
        private readonly warningModel: PaginateModel<WarningDocument>,

        @InjectModel(User.name)
        private readonly userModel: PaginateModel<UserDocument>, 

        private readonly mailerService: MailerService,



        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

        @Inject(forwardRef(() => ReportService))
        private readonly reportService: ReportService,

    ) { }


    async create(dto: CreateWarningDto): Promise<Warning> {
        // 1对1关系，所以要先清空
        await this.warningModel.deleteMany({ point: dto.pointId }).exec()
        return await this.warningModel.create({
            ...dto,
            point: dto.pointId,
        })
    }

    async findByPoint(point: string): Promise<Warning> {
        return await this.warningModel.findOne({
            point: point,
        })
    }

    async deleteByPoint(point: string): Promise<DeleteResult> {
        return await this.warningModel.deleteOne({
            point: point,
        })
    }

    async findById(id: string): Promise<Warning> {
        return await this.warningModel.findById(id).exec()
    }

    async findAllOpened(): Promise<WarningDocument[]> {
        const res = await this.warningModel.find({
            isOpen: true,
        }).populate({
            path: 'point',
        }).exec()

        // 过滤掉禁用的
        return res.filter(o=>o.point.isBlock == false)
    }

    async updateWarningTrigger(id: string, num?: number): Promise<WarningDocument> {

        // const r = await this.warningModel.findById(id).exec()

        return await this.warningModel.findOneAndUpdate({ _id: id }, {
            lastTriggerDate:moment().format('YYYY-MM-DD HH:mm:ss'),
        })

    }

    async updateWarningOpen(id: string,isOpen:boolean): Promise<WarningDocument> {

        return await this.warningModel.findOneAndUpdate({ _id: id }, {
            isOpen
        })

    }


    async dealByTask() {
        const list = await this.findAllOpened()

        list.forEach(item => {

            if (item.max && item.interval && item.point?.code) {
                this.dealSingleTask(item)
            }
        })
    }

    async dealSingleTask(item: WarningDocument) {

        const interval = item.interval
        const code = item.point.code
        const max = item.max


        const cur = moment().subtract(interval, 'minute').format('YYYY-MM-DD HH:mm:ss')
        const next = moment().format('YYYY-MM-DD HH:mm:ss')


        const result = await this.reportService.findAllByCode(code, cur, next, interval)


        for (var i = 0; i < result.list.length; i++) {
            var o = result.list[i] as any
            const { lastTriggerDate } = await this.findById(item._id)

            if (o.count >= max && (!lastTriggerDate || moment(lastTriggerDate).add(interval,'minute').isBefore(moment()))) { // 在时间间隔内只出发一次

                this.trigger(item)
                // 更新最近触发时间
                this.updateWarningTrigger(item._id)
                break
            }
        }
    }


    async trigger(item: WarningDocument) {
        const msg = '【Report Monitor】【' + item.point.code + '】触发监控告警'
        this.logger.info(msg)
        // console.log(msg)

        let start: string = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
        let end: string = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')

        let data: resultVo = await this.reportService.findAllByCode(item.point.code, start, end, 5);

        let res = formatData(data.list, start, end, 5)

        const svgstr = makeCharts(res)

        const locals = {
            message: item.message,
            name: item.point.desc,
            code: item.point.code,
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            chartSvg: svgstr
        };


        const u = await this.userModel.findOne({userid:(item.point.user) as unknown as string}).exec()

        if (u.email) {
            this.mailerService
            .sendMail({
                to: u.email,
                from: 'Report Monitor <monitor@nihaoshijie.com.cn>',
                subject: msg,
                html: emailStr(locals),
            })
            .catch((e) => { this.logger.error(e), console.log(e) });
        }

    }

}