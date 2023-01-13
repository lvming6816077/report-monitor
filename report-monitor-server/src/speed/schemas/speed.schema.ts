import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{ Document, Schema as _Schema} from 'mongoose';

import { SpeedTag } from "./speedtag.schema";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from "src/user/schemas/user.schema";
import { Project } from "src/project/schemas/project.schema";

export type SpeedDocument = Speed & Document &{
    warning?:Object
};


@Schema({timestamps:{createdAt: 'create',updatedAt:'update'},versionKey: false})
export class Speed {

    @Prop()
    desc: string;

    @Prop()
    code: string;

    @Prop({ type: _Schema.Types.ObjectId, ref: 'SpeedTag',required:true })
    tag: SpeedTag;

    @Prop({ type: String, ref: 'User',required:true })
    user: User;

    @Prop({ default: false }) // 是否禁用
    isBlock: boolean;

    @Prop({ type: String, ref: 'Project',required:true })
    project: Project;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;

}

export const SpeedSchema = SchemaFactory.createForClass(Speed,);

SpeedSchema.plugin(mongoosePaginate)

