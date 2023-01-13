import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as _Schema } from 'mongoose';
// import { Tag } from "src/point/schemas/tag.schema";
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ProjectDocument = Project &
    Document & {
        _id: string;
    };

@Schema({
    timestamps: { createdAt: 'create', updatedAt: 'update' },
    versionKey: false,
})
export class Project {
    @Prop()
    name: string;

    @Prop()
    projectCode: string;

    @Prop()
    desc: string;

    @Prop()
    type: string;

    @Prop({ default: [] })
    usersid: Array<string>;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.plugin(mongoosePaginate);
