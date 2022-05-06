import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Point, PointDocument } from './schemas/point.schema';
import { Tag, TagDocument } from './schemas/tag.schema';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid'


@Injectable()
export class PointService {
    constructor(@InjectModel(Point.name) private readonly pointModel: Model<PointDocument>,
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,) {}

    async findOne(id: string): Promise<Point> {
        return this.pointModel.findOne({ _id:id }).exec();
    }

    async findAll(): Promise<any[]> {
        let list = await this.tagModel.find({}).exec();
        let result = []
        for (var i = 0 ; i < list.length ; i++) {
            let children = this.pointModel.find({tag:list[i]._id}).exec()
            const o = {
                title:list[i].desc,
                key:list[i]._id,
                value:list[i]._id,
                children: (await children).map(k=>{
                    return {
                        title:k.desc+"("+k.code+")",
                        key:k.code,
                        value:k.code,
                        desc:k.desc
                    }
                })
            }
            result.push(o)
        }
        return result
    }
    async findOneByCode(code:string): Promise<Point[]> {
        return this.pointModel.find({code:code}).exec();
    }

    async createTag(desc:string): Promise<Tag> {
        return await this.tagModel.create({desc:desc});
    }

    async create(dto:any): Promise<Point> {
        const nanoid = customAlphabet('123456789', 6)
        const code = nanoid() // 随机且唯一code
        return await this.pointModel.create({
            code,
            tag:dto.tagId,
            desc:dto.desc,
        })
    }
    async findAllTags(): Promise<Tag[]> {
        let list = await this.tagModel.find({}).exec();
        console.log(list)
        return list
    }
    

    /*async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
        return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
    }*/
}