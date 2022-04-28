import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Point, PointDocument } from './schemas/point.schema';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid'


@Injectable()
export class PointService {
    constructor(@InjectModel(Point.name) private readonly pointModel: Model<PointDocument>,) {}

    async findOne(id: string): Promise<Point> {
        return this.pointModel.findOne({ _id:id }).exec();
    }

    async findAll(): Promise<Point[]> {
        let list = await this.pointModel.find({}).exec();
        return (list).filter(o=>o.code)
    }
    async findOneByCode(code:string): Promise<Point[]> {
        return this.pointModel.find({code:code}).exec();
    }

    async create(desc: string): Promise<Point> {
        const nanoid = customAlphabet('123456789', 6)
        const code = nanoid() // 随机且唯一code
        return await this.pointModel.create({
            code,
            desc,
        })
    }

    /*async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
        return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
    }*/
}