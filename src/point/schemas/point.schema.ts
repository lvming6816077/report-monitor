import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{ Document, Schema as _Schema} from 'mongoose';

import { Tag } from "./tag.schema";
import * as mongoosePaginate from 'mongoose-paginate';

export type PointDocument = Point & Document;

// interface Point extends Document {

//     _id: string;
//     create?: string;
// }

@Schema({timestamps:{createdAt: 'create',updatedAt:'update'}})
export class Point {

    @Prop({unique:true})
    desc: string;

    @Prop()
    code: string;

    @Prop({ type: _Schema.Types.ObjectId, ref: 'Tag',required:true })
    tag: Tag;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;

}

export const PointSchema = SchemaFactory.createForClass(Point);

PointSchema.plugin(mongoosePaginate)

/*var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
  content: String,
  post:{ type: Schema.Types.ObjectId, ref: 'Post',required:true },
  user:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
  create: { type: Date, default: Date.now },
  update: { type: Date, default: Date.now },
}, {timestamps:{createdAt: 'create',updatedAt:'update'}});



module.exports = mongoose.model('Comment', CommentSchema);*/