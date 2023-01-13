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
import { SpeedService } from './speed.service';
import { Speed, SpeedDocument } from './schemas/speed.schema';
import { SpeedTag, SpeedTagDocument } from './schemas/speedtag.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';

import { PaginateResult } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { UserService } from 'src/user/user.service';

import { WarningService } from 'src/warning/warning.service';
import { CreateSpeedTagDto } from './dto/create-speed-tag.dto';
import { QuerySpeedTagDto } from './dto/query-speed-tag.dto';
import { CreateSpeedDto } from './dto/create-speed.dto';
import { QuerySpeedDto } from './dto/query-speed.dto';

@Controller('speed')
@UseGuards(JwtAuthGuard)
export class SpeedController {
    constructor(
        private readonly speedService: SpeedService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

        private readonly warningService: WarningService,

        private readonly userService: UserService,
    ) {}

    @Post('createspeedtag')
    async createSpeedTag(@Body() dto: CreateSpeedTagDto, @Request() req: any) {
        return await this.speedService.createTag(dto.desc, dto.projectId);
    }

    @Get('getTagsList')
    async getTagsList(
        @Query() query: QuerySpeedTagDto,
    ): Promise<PaginateResult<SpeedTagDocument>> {
        return this.speedService.findAllTagByPage(
            query.pageStart,
            query.pageSize,
            query,
        );
    }
    @Get('getTags')
    async getTags(@Query() query): Promise<SpeedTag[]> {
        return this.speedService.findAllTags(query);
    }

    @Post('create')
    async createSpeed(@Body() dto: CreateSpeedDto, @Request() req: any) {
        return await this.speedService.create(dto);
    }
    @Get('getSpeedsList')
    async getPointsList(@Query() query: QuerySpeedDto) {
        const result = await this.speedService.findAllByPage(
            query.pageStart,
            query.pageSize,
            query,
        );

        return result;
    }

    @Post('saveSpeedSet')
    async saveSpeedSet(@Body() dto: { codes?: string[] }, @Request() req: any) {
        const u = await this.userService.updateUser(req.user.userId, {
            speedset: dto.codes.join(','),
        });
        return u.pointset;
    }

    @Get('getSpeedsAndSpeedset')
    async getSpeedsAndSpeedset(@Request() req: any): Promise<any> {
        const speedset = await this.userService.findUserSpeedSet(
            req.user.userId,
        );
        const projectId = req.query.projectId;

        const list = await this.speedService.findAll(projectId);
        return {
            speedset: speedset,
            list,
        };
    }
}
