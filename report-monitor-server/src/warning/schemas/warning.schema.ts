import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{ Document, Schema as _Schema} from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from "src/user/schemas/user.schema";
import {Point} from "src/point/schemas/point.schema"

export type WarningDocument = Warning & Document&{
    _id:string
};

@Schema({timestamps:{createdAt: 'create',updatedAt:'update'},versionKey:false})
export class Warning {

    @Prop()
    desc: string;

    @Prop({type: Boolean, default: false}) // 是否开启
    isOpen: boolean;

    @Prop()
    max: number; // 最大值（count值）

    @Prop()
    min: number;// 最小值（count值）

    @Prop()
    interval: number;// 间隔（分钟）

    @Prop()
    type: string;// 类型

    @Prop()
    message: string;// 告警文案

    @Prop({ default:''}) // 最近触发时间
    lastTriggerDate: string;

    @Prop({ type: _Schema.Types.ObjectId, ref: 'Point',required:true})
    point: Point;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;

}

export const WarningSchema = SchemaFactory.createForClass(Warning);
WarningSchema.plugin(mongoosePaginate)