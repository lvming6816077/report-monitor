import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document,Schema as _Schema} from 'mongoose';
import { Tag } from "src/point/schemas/tag.schema";


export type LogDocument = Log & Document;



@Schema({timestamps:{createdAt: 'create',updatedAt:'update'},versionKey: false})
export class Log {

    @Prop()
    str: string;

    @Prop({ type: _Schema.Types.ObjectId, ref: 'Tag',required:true })
    tag: Tag;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
