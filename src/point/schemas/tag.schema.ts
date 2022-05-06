import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({timestamps:{createdAt: 'create',updatedAt:'update'}})
export class Tag {

    @Prop({unique:true})
    desc: string;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;

}

export const TagSchema = SchemaFactory.createForClass(Tag);
