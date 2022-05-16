import { Body, Controller, Delete, Get, Param, Post,Inject,UseGuards} from '@nestjs/common';
import { PointService } from './point.service';
import { Point } from './schemas/point.schema';
import { Tag } from './schemas/tag.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';
import { JwtAuthGuard } from 'src/config/jwt-config/jwtAuth.guard';
import { CreatePointDto } from './dto/create-point.dto'
import { CreateTagDto } from './dto/create-tag.dto'

@Controller('point')
@UseGuards(JwtAuthGuard)
export class PointController {
  constructor(private readonly pointService: PointService, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}


  @Post('create')
  async createPoint(@Body() dto:CreatePointDto) {
      console.log(dto)
      return await this.pointService.create(dto);
  }
  @Post('createtag')
  async createTag(@Body() dto:CreateTagDto) {
      console.log(dto)
      return await this.pointService.createTag(dto.desc);
  }

  @Get('getPoints')
  async getPoints(): Promise<Point[]> {
    // this.logger.info(PointController.name+`Processing job11 `)
    return this.pointService.findAll();
  }
  
  @Get('getTags')
  async getTags(): Promise<Tag[]> {
    return this.pointService.findAllTags();
  }

  @Get(':id')
  async getPointById(@Param('id') id: string): Promise<Point> {
    return this.pointService.findOne(id);
  }

//   @Delete(':id')
//   async delete(@Param('id') id: string) {
//     return this.catsService.delete(id);
//   }
}