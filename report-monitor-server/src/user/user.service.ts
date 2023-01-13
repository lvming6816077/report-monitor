import { Injectable,Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';
import { PointService } from '../point/point.service';
import { HttpException } from '@nestjs/common';
import { customAlphabet } from 'nanoid'
import * as bcrypt from 'bcrypt';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';
import { UpdateUserDto } from "./dto/update-user.dto";
import { RedisInstanceService } from "src/config/redis-config/redis.service";
import { SpeedService } from "src/speed/speed.service";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: PaginateModel<UserDocument>, 


        @Inject(forwardRef(() => PointService))
        private readonly pointService: PointService,

        @Inject(forwardRef(() => SpeedService))
        private readonly speedService: SpeedService,

        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger) { 

        }


    async createUser(username: string, password: string,nickname:string): Promise<User> {
        const u = await this.userModel.findOne({username})
        if (u) {
            throw new HttpException('用户已存在', 200);
        }
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        const nanoid = customAlphabet('123456789xsdqw', 10)
        const userid = nanoid() // 随机且唯一userid
        return await this.userModel.create({ username,userid,password:hash,level:[1],nickname });
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
        const u = await this.userModel.findOne({userid}).lean().exec()

        return {
            ...u,
            password: null
        } as unknown as User
    }
    async findUserByUserEmail(email: string): Promise<User> {
        return await this.userModel.findOne({email})
    }
    async findUserPointSet(userid: string): Promise<string> {

        const { pointset } = await this.userModel.findOne({userid});

        let arr = pointset?.split(',')||[]
        let res = []

        for (let i = 0 ; i < arr.length ; i++) {
            const p = await this.pointService.findOneByCode(arr[i])
            if (p) {
                res.push(p.code)
            }
        }

        return res.join(',')
    }
    async findUserSpeedSet(userid: string): Promise<string> {

        const { speedset } = await this.userModel.findOne({userid});

        let arr = speedset?.split(',')||[]
        let res = []

        for (let i = 0 ; i < arr.length ; i++) {
            const p = await this.speedService.findOneByCode(arr[i])
            if (p) {
                res.push(p.code)
            }
        }

        return res.join(',')
    }

    

    async updateUser(userid:string,userDto:UpdateUserDto):Promise<User> {
        return await this.userModel.findOneAndUpdate({ userid }, userDto).exec();
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
        if (query.nickname) {
            q.nickname = {$regex: query.nickname, $options: 'i'}
        }


        const result = await this.userModel.paginate(q,options)

        return result
    }
    
}