import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as _Schema } from 'mongoose';
import { Speed } from 'src/speed/schemas/speed.schema';

import { Point, PointSchema } from '../../point/schemas/point.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ReportDocument = Report & Document;

// @Schema({timestamps:{createdAt: 'create'}})
@Schema({ versionKey: false })
export class Report {
    @Prop({ type: _Schema.Types.ObjectId, ref: 'Point', index: true })
    point: Point;

    @Prop({ type: _Schema.Types.ObjectId, ref: 'Speed', index: true })
    speed: Speed;

    @Prop()
    d: number; // 时间长度 单位ms

    @Prop()
    ip: string; // ip地址

    @Prop()
    city: string;// 市

    @Prop()
    province: string;// 省

    @Prop()
    browser: string; // 浏览器

    @Prop()
    os: string; // 操作系统

    @Prop()
    ua: string; // user-agent

    @Prop()
    referer: string; // referer

    @Prop()
    network: string; // 网络


    @Prop({ type: _Schema.Types.Mixed, default: {} }) // 附属信息
    meta: any;

    @Prop({ type: Date, required: true })
    create: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

ReportSchema.plugin(mongoosePaginate);

/*var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
  content: String,
  post:{ type: Schema.Types.ObjectId, ref: 'Post',required:true },
  user:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
  create: { type: Date, default: Date.now },
  update: { type: Date, default: Date.now },
}, {timestamps:{createdAt: 'create',updatedAt:'update'}});



module.exports = mongoose.model('Comment', CommentSchema);*/
