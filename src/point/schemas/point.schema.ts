import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{ Document, Schema as _Schema} from 'mongoose';

import { Tag } from "./tag.schema";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from "src/user/schemas/user.schema";

export type PointDocument = Point & Document;


@Schema({timestamps:{createdAt: 'create',updatedAt:'update'}})
export class Point {

    @Prop()
    desc: string;

    @Prop()
    code: string;

    @Prop({ type: _Schema.Types.ObjectId, ref: 'Tag',required:true })
    tag: Tag;

    @Prop({ type: String, ref: 'User',required:true })
    user: User;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;

}

export const PointSchema = SchemaFactory.createForClass(Point);

PointSchema.plugin(mongoosePaginate)

