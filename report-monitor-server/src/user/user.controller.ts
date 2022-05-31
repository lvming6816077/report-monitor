import { Body, Controller, Req, Get, Res, Post, Injectable, Query } from '@nestjs/common';
import { UserService } from './user.service';
const parser = require('cron-parser');
import { JwtConfigService } from 'src/config/jwt-config/jwt-config.service';
import { User } from './schemas/user.schema';
import { HttpException } from '@nestjs/common';
import { LoginDto } from './dto/login';
import { QueryUserDto } from './dto/query-user.dto'

import * as svgCaptcha from 'svg-captcha';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
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
    @Post('update')
    async update(@Body() body: UpdateUserDto,@Req() req) {
        delete body.username

        const level = body.level.map(d=>Number(d))
        
        const u = await this.userService.updateUser(body.userid,{
            ...body,
            level
        })
        if (u.userid) {
            return 'success'
        }

        return 'error'

    }
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


    



}