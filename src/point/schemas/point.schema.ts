import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type PointDocument = Point & Document;

@Schema({timestamps:{createdAt: 'create',updatedAt:'update'}})
export class Point {

    @Prop()
    desc: string;

    @Prop()
    code: string;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;

}

export const PointSchema = SchemaFactory.createForClass(Point);

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