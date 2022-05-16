import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document,Schema as _Schema} from 'mongoose';

import { Point, PointSchema } from "../../point/schemas/point.schema";

export type ReportDocument = Report & Document;

// @Schema({timestamps:{createdAt: 'create'}})
@Schema()
export class Report {

    @Prop({ type: _Schema.Types.ObjectId, ref: 'Point',required:true })
    point: Point;

    @Prop({ type: Date, required:true })
    create: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

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