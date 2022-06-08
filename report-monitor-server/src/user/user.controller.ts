import { Body, Controller, Req, Get, Res, Post, Request, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
const parser = require('cron-parser');
import { JwtConfigService } from 'src/config/jwt-config/jwt-config.service';
import { User } from './schemas/user.schema';
import { HttpException } from '@nestjs/common';
import { LoginDto } from './dto/login';
import { QueryUserDto } from './dto/query-user.dto'

import * as svgCaptcha from 'svg-captcha';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { RedisInstanceService } from 'src/config/redis-config/redis.service';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';
import * as moment from 'moment';
import getStr from 'src/config/email-config/templates/code';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';




@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,

        private readonly mailerService: MailerService,

        private readonly redisService: RedisInstanceService,
        
        private readonly jwt: JwtConfigService,) { }

    @Get('getCaptcha')
    async getCaptcha(@Req() req, @Res() res) {

        const captcha = svgCaptcha.create({
            ignoreChars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',// 排除字母，只用数字
            noise: 2 // 干扰线条的数量
        });

        req.session.checkcode = captcha.text; //使用session保存验证，用于登陆时验证

        res.type('image/svg+xml'); //指定返回的类型
        res.send(captcha.data); //给页面返回一张图片
    }


    @Post('login')
    async login(@Body() body: LoginDto,@Req() req) {

        const { checkcode } = body;
        if (checkcode?.toUpperCase() !== req.session.checkcode?.toUpperCase()) {
            throw new HttpException('验证码错误', 200);
        }

        const u:User = await this.userService.findUser(body.username,body.password)
        if (u) {
            return this.jwt.login(u);
        }
        return null
    }


    @Post('regis')
    async regis(@Body() body: LoginDto,@Req() req) {

        const { checkcode } = body;
        if (checkcode?.toUpperCase() !== req.session.checkcode?.toUpperCase()) {
            throw new HttpException('验证码错误', 200);
        }

        return await this.userService.createUser(body.username,body.password,body.nickname)

    }
    @UseGuards(JwtAuthGuard)
    @Post('update')
    async update(@Body() body: UpdateUserDto,@Req() req) {
        delete body.username

        const level = body.level ? body.level.map(d=>Number(d)) : null

        const opt = {
            ...body,
        }

        if (level) {
            opt.level = level
        }
        
        const u = await this.userService.updateUser(body.userid,opt)
        if (u.userid) {
            return 'success'
        }

        return 'error'

    }
    @UseGuards(JwtAuthGuard)
    @Get('getUsersList')
    async getUsersList(@Query() query: QueryUserDto) {
        const result = await this.userService.findAllByPage(query.pageStart,query.pageSize,query)
        const l = result.docs.map(i=>{
            return {
                username:i.username,
                create:i.create,
                nickname:i.nickname,
                _id:i._id,
                userid:i.userid,
                level:i.level,
            }
        })
        return {
            ...result,
            docs:l,
        }

    }

    @Get('getUserById')
    async getUserById(@Query() query) {
        const u = await this.userService.findUserByUserId(query.id)

        return  {
            level: u.level,
            email:u.email,
            phone: u.phone,
            nickname:u.nickname,
            username: u.username
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('sendEmailCode')
    async sendEmailCode(@Query() query, @Request() req: any) {
        if (!query.email) {
            
            throw new HttpException('email缺失', 200); 
        }

        const u = await this.userService.findUserByUserEmail(query.email)
        if (u) {
            throw new HttpException('email已绑定', 200); 
        }
        const {username} = await this.userService.findUserByUserId(req.user.userId)
        const key = username+'email-code'
        const redisCode = this.redisService.get(key)

        if (redisCode) {
            this.redisService.del(key)
        }

        //随机获取6位数字
        var s2msCode = Math.random().toString().slice(-6)

        this.redisService.set(key,{
            code:s2msCode,
            date:moment().format('YYYY-MM-DD HH:mm:ss')
        })


        const res = await this.mailerService
        .sendMail({
            to: query.email,
            from: 'Report Monitor <monitor@nihaoshijie.com.cn>',
            subject: '【Report Monitor】【邮箱验证码】',
            html: getStr({s2msCode}),
        })

        return 'success'
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('updateEmail')
    async updateEmail(@Body() body:UpdateUserEmailDto, @Request() req: any) {

        const {username} = await this.userService.findUserByUserId(req.user.userId)
        const key = username+'email-code'
        const redisCode:any = await this.redisService.get(key)
        
        if (redisCode) {
            const {date,code} = JSON.parse(redisCode)

            console.log(code,body.code)

            if (moment(date).add(5,'minute').isBefore(moment())) {
                this.redisService.del(key)
                throw new HttpException('验证码失效', 200); 
            }

            if (code != body.code) {
                throw new HttpException('验证码错误', 200); 
            }

            const u = await this.userService.updateUser(req.user.userId,{email:body.email})
            if (u.userid) {
                this.redisService.del(key)
                return 'success'
            }


        } else {
            throw new HttpException('验证码无效', 200); 
        }


    }

}