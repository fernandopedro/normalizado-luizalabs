import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdersService } from './orders.service';
import { OrdersFilterDto } from './dto/filters.dto';
import { ValidationPipe } from '@nestjs/common';
import { ValidateIf } from 'class-validator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('Nenhum arquivo enviado');
    }

    const result = this.ordersService.parseFile(file.buffer.toString('utf8'));
    return result;
  }

  @Get()
  async getOrders(@Query(new ValidationPipe({ transform: true })) filters: OrdersFilterDto) {
    return this.ordersService.getOrders(filters);
  }
}
    