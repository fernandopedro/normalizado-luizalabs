import { IsOptional, IsNumberString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class OrdersFilterDto {
  @IsOptional()
  @IsNumberString()
  orderId?: string;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;
}
