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
import { PointService } from './point.service';
import { Point, PointDocument } from './schemas/point.schema';
import { Tag, TagDocument } from './schemas/tag.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';
import { CreatePointDto } from './dto/create-point.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { QueryPointDto } from './dto/query-point.dto';
import { QueryTagDto } from './dto/query-tag.dto';
import { PaginateResult } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { UserService } from 'src/user/user.service';
import { UpdatePointDto } from './dto/update-point.dto';
import { WarningService } from 'src/warning/warning.service';
import { QueryReportDto } from 'src/report/dto/query-report.dto';

@Controller('point')
@UseGuards(JwtAuthGuard)
export class PointController {
    constructor(
        private readonly pointService: PointService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

        private readonly warningService: WarningService,

        private readonly userService: UserService,
    ) {}

    @Post('create')
    async createPoint(@Body() dto: CreatePointDto, @Request() req: any) {
        return await this.pointService.create(dto);
    }
    @Post('createtag')
    async createTag(@Body() dto: CreateTagDto, @Request() req: any) {
        return await this.pointService.createTag(dto.desc, dto.projectId);
    }
    @Post('savePointSet')
    async savePointSet(@Body() dto: { codes: string[],projectId:string }, @Request() req: any) {
        if (!dto.projectId) {
            throw new HttpException('projectId缺失', 200);
        }

        // 查询之前的
        const { pointset } = await this.userService.findUserByUserId(req.user.userId)

        pointset[dto.projectId] = dto.codes.join(',')
        const u = await this.userService.updateUser(req.user.userId, {
            pointset: pointset,
        });
        return u.pointset;
    }

    @Get('getPoints')
    async getPoints(): Promise<Point[]> {
        return this.pointService.findAll('');
    }

    @Get('getPointsAndPointset')
    async getPointsAndPointset(@Request() req: any): Promise<any> {
        const pointset = await this.userService.findUserPointSet(
            req.user.userId,
        );
        const projectId = req.query.projectId;

        const list = await this.pointService.findAll(projectId);
        return {
            pointset: pointset[projectId],
            list,
        };
    }
    @Get('getPointsList')
    async getPointsList(@Query() query: QueryPointDto) {
        const result = await this.pointService.findAllByPage(
            query.pageStart,
            query.pageSize,
            query,
        );

        return result;
    }
    @Get('getTagsList')
    async getTagsList(
        @Query() query: QueryTagDto,
    ): Promise<PaginateResult<TagDocument>> {
        return this.pointService.findAllTagByPage(
            query.pageStart,
            query.pageSize,
            query,
        );
    }
    @Get('getPointsAllList')
    async getPointsAllList(
        @Query() query: QueryPointDto,
    ): Promise<PaginateResult<PointDocument>> {
        return this.pointService.findAllAdminByPage(
            query.pageStart,
            query.pageSize,
            query,
        );
    }

    @Get('getTags')
    async getTags(@Query() query): Promise<Tag[]> {
        return this.pointService.findAllTags(query);
    }

    @Get(':id')
    async getPointById(@Param('id') id: string): Promise<Point> {
        return this.pointService.findOne(id);
    }

    @Get('deletePoint/:id')
    async deletePoint(@Param('id') id: string): Promise<DeleteResult> {
        return this.pointService.deleteById(id);
    }

    @Get('deleteTag/:id')
    async deleteTag(@Param('id') id: string): Promise<DeleteResult> {
        return this.pointService.deleteTagById(id);
    }

    @Post('updatePoint')
    async updatePoint(@Body() dto: UpdatePointDto, @Request() req: any) {
        if (!dto._id) {
            throw new HttpException('id缺失', 200);
        }
        return await this.pointService.updatePoint(dto._id, dto);
    }
    @Get('getPointDetail/:code')
    async getPointDetail(@Param('code') code: string): Promise<Point> {
        return this.pointService.findOneByCode(code);
    }

    //   @Delete(':id')
    //   async delete(@Param('id') id: string) {
    //     return this.catsService.delete(id);
    //   }
}
