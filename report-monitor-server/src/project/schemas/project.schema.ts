import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document,Schema as _Schema} from 'mongoose';
// import { Tag } from "src/point/schemas/tag.schema";


export type ProjectDocument = Project & Document;



@Schema({timestamps:{createdAt: 'create',updatedAt:'update'},versionKey: false})
export class Project {

    @Prop()
    desc: string;

    // @Prop({ type: _Schema.Types.ObjectId, ref: 'Tag',required:true })
    // tag: Tag;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
