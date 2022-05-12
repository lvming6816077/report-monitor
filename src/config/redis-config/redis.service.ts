import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisInstanceService {
    private client: Redis;  //使用ioredis给clinet注解，这样才能获取多个方法的提示
    constructor(private redisService: RedisService) { }

    //nest的生命周期函数，使用该service时，构建一个redis的clinet
    onModuleInit(): void {
        this.getClient();
    }

    private getClient() {
        this.client = this.redisService.getClient();  //连接clinet
    }

    /**
     * @Description: 封装设置redis缓存的方法
     * @param key {String} key值
     * @param value {String} key的值
     * @param seconds {Number} 过期时间
     * @return: Promise<any>
     */
    public async set(key: string, value: any, seconds?: number): Promise<any> {
        value = JSON.stringify(value);
        if (!seconds) {
            await this.client.set(key, value);
        } else {
            await this.client.set(key, value, 'EX', seconds);
        }
    }

    /**
     * @Description: 设置获取redis缓存中的值
     * @param key {String}
     */
    public async get(key: string): Promise<any> {
        const data = await this.client.get(key);
        // const data = await this.client.hgetall(key);
        if (data) return data;
        return null;
    }

    /**
     * @Description: 根据key删除redis缓存数据
     * @param key {String}
     * @return:
     */
    public async del(key: string): Promise<any> {
        return await this.client.del(key);
    }

    /**
     * @Description: 清空redis的缓存
     * @param {type}
     * @return:
     */
    public async flushall(): Promise<any> {
        return await this.client.flushall();
    }

    public async rpop(key: string): Promise<any> {
        return await this.client.rpop(key);
    }
    public async lpush(key: string, value:string): Promise<any> {
        return await this.client.lpush(key,value);
    }
    public async llen(key: string, value?:string): Promise<number> {
        return await this.client.llen(key);
    }
}