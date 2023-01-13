import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as _Schema } from 'mongoose';

import { Project } from 'src/project/schemas/project.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type LogDocument = Log & Document;

@Schema({
    timestamps: { createdAt: 'create', updatedAt: 'update' },
    versionKey: false,
})
export class Log {
    @Prop()
    str: string;

    @Prop({ type: _Schema.Types.ObjectId, ref: 'Project', required: true })
    project: Project;

    @Prop()
    ua: string;

    @Prop()
    ip: string;

    @Prop({ type: _Schema.Types.Mixed, default: {} })
    meta: any;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
LogSchema.plugin(mongoosePaginate);
