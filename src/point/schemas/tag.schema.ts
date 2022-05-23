import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{ Document, Schema as _Schema} from 'mongoose';
import { User } from "src/user/schemas/user.schema";
import {Point} from "./point.schema"

export type TagDocument = Tag & Document;

@Schema({timestamps:{createdAt: 'create',updatedAt:'update'}})
export class Tag {

    @Prop()
    desc: string;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: String, ref: 'User',required:true })
    user: User;

    @Prop({ type: Date, default: Date.now })
    update: string;

}

export const TagSchema = SchemaFactory.createForClass(Tag);
