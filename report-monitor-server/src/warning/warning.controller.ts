import { Body, Controller, Query, Get, Param, Post, Inject, UseGuards, Request, HttpException } from '@nestjs/common';


import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';

import { PaginateResult } from 'mongoose';
import { DeleteResult } from 'mongodb'
import { UserService } from 'src/user/user.service';
import { WarningService } from './warning.service';
import { CreateWarningDto } from './dto/create-warning.dto';

@Controller('warning')
@UseGuards(JwtAuthGuard)
export class WarningController {
    constructor(
        private readonly warningService: WarningService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

        private readonly userService: UserService,
    ) { }


    
    @Post('addWarningSet')
    async addWarningSet(@Body() dto: CreateWarningDto, @Request() req: any) {

        return await this.warningService.create(dto);
    }

    @Get('updateWarningOpen')
    async updateWarningOpen(@Query() query) {

        return await this.warningService.updateWarningOpen(query.id,false)

    }
}


