import {
    Body,
    Controller,
    Query,
    Get,
    Param,
    Post,
    Inject,
    UseGuards,
    Request,
    HttpException,
} from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';


import { PaginateResult } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { UserService } from 'src/user/user.service';
import { WarningService } from './warning.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('warning')

export class WarningController {
    constructor(
        private readonly warningService: WarningService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

        private readonly mailerService: MailerService,

        private readonly userService: UserService,
    ) {}
    
    @UseGuards(JwtAuthGuard)
    @Post('addWarningSet')
    async addWarningSet(@Body() dto: CreateWarningDto, @Request() req: any) {
        console.log(req.user);
        const u = await this.userService.findUserByUserId(req.user.userId);
        if (!u.email) {
            throw new HttpException('暂未绑定Email，请先绑定！', 200);
        }
        return await this.warningService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('updateWarningOpen')
    async updateWarningOpen(@Query() query) {
        return await this.warningService.updateWarningOpen(query.id, false);
    }

    @Post('helpMeSendMail')
    async helpMeSendMail(@Body() dto: any, @Request() req: any) {
        
        return this.mailerService
                .sendMail({
                    to: dto.email,
                    from: 'Report Monitor <monitor@nihaoshijie.com.cn>',
                    subject: dto.subject,
                    text: dto.text,
                })
                .catch((e) => {
                    this.logger.error(e), console.log(e);
                });
    }
}
