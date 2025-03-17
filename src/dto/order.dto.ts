import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EOrderStatus } from '../entities/order.entity';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: EOrderStatus,
    example: EOrderStatus.pending,
  })
  status: EOrderStatus;
}
