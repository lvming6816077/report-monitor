import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as _Schema } from 'mongoose';

import { Tag } from './tag.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from 'src/user/schemas/user.schema';
import { Project } from 'src/project/schemas/project.schema';

export type PointDocument = Point &
    Document & {
        warning?: Object;
    };

@Schema({
    timestamps: { createdAt: 'create', updatedAt: 'update' },
    versionKey: false,
})
export class Point {
    _id:string;
    
    @Prop()
    desc: string;

    @Prop()
    code: string;

    @Prop({ type: _Schema.Types.ObjectId, ref: 'Tag', required: true })
    tag: Tag;

    @Prop({ type: String, ref: 'User', required: true })
    user: User;

    @Prop({ default: false }) // 是否禁用
    isBlock: boolean;

    @Prop({ type: String, ref: 'Project', required: true })
    project: Project;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;
}

export const PointSchema = SchemaFactory.createForClass(Point);

PointSchema.plugin(mongoosePaginate);
