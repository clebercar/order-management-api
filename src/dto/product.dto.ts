import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Laptop',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'A short description of the product',
    example: 'A high-end gaming laptop with RGB keyboard.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 1299.99,
    type: 'number',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'The quantity of the product in stock',
    example: 50,
    type: 'integer',
  })
  @IsNumber()
  @IsPositive()
  stockQuantity: number;
}

export class UpdateProductDto extends CreateProductDto {}
