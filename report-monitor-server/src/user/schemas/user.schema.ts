import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document,Schema as _Schema} from 'mongoose';

import * as mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = User & Document;



@Schema({timestamps:{createdAt: 'create',updatedAt:'update'}})
export class User {

    @Prop({ required:true,unique:true})// 用户id
    userid: string;

    @Prop({ required:true,unique:true })// 用户名称
    username: string;

    @Prop({ required:true })// 用户密码
    password: string;

    @Prop({ required:true,default:[1] }) // 用户等级（0：管理员，1：普通用户）
    level: [];

    @Prop() // 用户预设point
    pointset: string;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongoosePaginate)
