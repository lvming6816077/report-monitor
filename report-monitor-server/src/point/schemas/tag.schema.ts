import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{ Document, Schema as _Schema} from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from "src/user/schemas/user.schema";
import {Project} from "../../project/schemas/project.schema"

export type TagDocument = Tag & Document;

@Schema({timestamps:{createdAt: 'create',updatedAt:'update'},versionKey: false})
export class Tag {

    @Prop()
    desc: string;

    @Prop()
    code: string;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: String, ref: 'User',required:true })
    user: User;

    @Prop({ type: String, ref: 'Project',required:true })
    project: Project;

    @Prop({ type: Date, default: Date.now })
    update: string;

    _id:string
}



export const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.plugin(mongoosePaginate)