import { Body, Controller, Delete, Get, Param, Post,Inject} from '@nestjs/common';
import { PointService } from './point.service';
import { Point } from './schemas/point.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger  } from 'winston';
import { CreatePointDto } from './dto/create-point.dto'

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}


  @Post('create')
  async createPoint(@Body() dto:CreatePointDto) {
      console.log(dto)
      return await this.pointService.create(dto.desc);
  }

  @Get('getPoints')
  async getPoints(): Promise<Point[]> {
    // this.logger.info(PointController.name+`Processing job11 `)
    return this.pointService.findAll();
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