import { Injectable } from '@nestjs/common';

import { PrismaService } from '../services/prisma.service';
import { ProductAttributes, ProductEntity } from '../entities/product.entity';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductRepository {
  private orm: PrismaService['product'];

  constructor(private prisma: PrismaService) {
    this.orm = this.prisma.product;
  }

  async create(data: ProductEntity) {
    const product = await this.orm.create({
      data: data.toData(),
    });

    return this.parseToEntity(product);
  }

  async update(id: string, data: Partial<ProductAttributes>) {
    const product = await this.orm.update({
      where: { id },
      data,
    });

    return this.parseToEntity(product);
  }

  async delete(id: string) {
    await this.orm.delete({
      where: { id },
    });
  }

  async decrementStockQuantity(id: string, quantity: number) {
    await this.prisma.product.update({
      where: { id },
      data: {
        stockQuantity: {
          decrement: quantity,
        },
      },
    });
  }

  async incrementStockQuantity(id: string, quantity: number) {
    await this.prisma.product.update({
      where: { id },
      data: {
        stockQuantity: {
          increment: quantity,
        },
      },
    });
  }

  async findById(id: string) {
    const product = await this.orm.findUnique({
      where: {
        id,
      },
    });

    if (!product) return;

    return this.parseToEntity(product);
  }

  async findMany(ids: string[]) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
    });

    if (!products.length) return [];

    return products.map(this.parseToEntity);
  }

  async findAll() {
    const products = await this.orm.findMany();

    if (!products.length) return [];

    return products.map(this.parseToEntity);
  }

  private parseToEntity(
    product: Omit<ProductAttributes, 'price'> & { price: Decimal },
  ) {
    return new ProductEntity({
      ...product,
      price: Number(product.price),
    });
  }
}
