import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document,Schema as _Schema} from 'mongoose';


export type UserDocument = User & Document;


@Schema({timestamps:{createdAt: 'create',updatedAt:'update'}})
export class User {

    @Prop({ required:true,unique:true,dropDups: true })// 用户id
    userid: string;

    @Prop({ required:true,unique:true,dropDups: true })// 用户名称
    username: string;

    @Prop({ required:true })// 用户密码
    password: string;

    @Prop({ required:true,default:1 }) // 用户等级（0：管理员，1：普通用户）
    level: number;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

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