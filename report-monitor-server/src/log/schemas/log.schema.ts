import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document,Schema as _Schema} from 'mongoose';


export type LogDocument = Log & Document;



@Schema({timestamps:{createdAt: 'create',updatedAt:'update'},versionKey: false})
export class Log {

    @Prop()
    str: string;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
