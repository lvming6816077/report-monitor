import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as _Schema } from 'mongoose';

import * as mongoosePaginate from 'mongoose-paginate-v2';


export type UserDocument = User & Document;

export type PointsetType = {
    [key:string]:string
}

@Schema({
    timestamps: { createdAt: 'create', updatedAt: 'update' },
    versionKey: false,
    minimize: false
})
export class User {
    _id:string;
    
    @Prop({ required: true, unique: true }) // 用户id
    userid: string;

    @Prop({ required: true, unique: true }) // 用户账号
    username: string;

    @Prop() // 用户昵称
    nickname: string;

    @Prop({ required: true }) // 用户密码
    password: string;

    @Prop({ required: true, default: [1] }) // 用户等级（0：管理员，1：普通用户）
    level: [];

    @Prop({ required: false }) // 用户邮箱
    email: string;

    @Prop({}) // 用户phone
    phone: string;

    @Prop({ type: _Schema.Types.Mixed, required: true,default: {} }) // 用户预设point
    pointset: PointsetType;

    @Prop({ type: _Schema.Types.Mixed, default: {} }) // 用户预设speed
    speedset: PointsetType;

    @Prop({ type: _Schema.Types.Mixed,default: [] }) // 用户关联的项目
    projectsid: Array<string>;

    @Prop() // 用户当前项目
    activePid: string;

    @Prop({ type: Date, default: Date.now })
    create: string;

    @Prop({ type: Date, default: Date.now })
    update: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongoosePaginate);
