import { Injectable,Inject } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';
import { PointService } from '../point/point.service';
import { HttpException } from '@nestjs/common';
import { customAlphabet } from 'nanoid'
import * as bcrypt from 'bcrypt';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: PaginateModel<UserDocument>, 

        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { 

        }



    async createUser(username: string, password: string): Promise<User> {
        const u = await this.userModel.findOne({username})
        if (u) {
            throw new HttpException('用户已存在', 200);
        }
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        const nanoid = customAlphabet('123456789xsdqw', 10)
        const userid = nanoid() // 随机且唯一userid
        return await this.userModel.create({ username,userid,password:hash,level:1 });
    }
    async findUser(username: string, password: string): Promise<User> {
        const u = await this.userModel.findOne({username})
        if (!u) {
            throw new HttpException('用户不存在', 200);
        }
        
        const isMatch = await bcrypt.compare(password, u.password);
        if (!isMatch) {
            throw new HttpException('用户名密码不匹配', 200);
        }

        return u

    }
    async findUserByUserId(userid: string): Promise<User> {
        return await this.userModel.findOne({userid})
    }

    async updateUser(pointset:string,userid:string):Promise<User> {
        const u = await this.userModel.findOneAndUpdate({ userid }, {pointset});

        return u
    }
    async findAllByPage(pageStart:string='1', pageSize: string='10',query:User): Promise<PaginateResult<UserDocument>> {
        const options = {
            page: Number(pageStart),
            limit: Number(pageSize),
        };
        const q:any = {}
        if (query.username) {
            q.username = {$regex: query.username, $options: 'i'}
        }
        // let d = await this.userModel.find({})
        console.log(q)

        const result = await this.userModel.paginate(q,options)
        console.log(result)
        return result
    }
}