import { Injectable } from '@nestjs/common';
import { Item, OrderEntity, OrderStatus } from '../entities/order.entity';
import { UpdateOrderStatusDto } from '../dto/order.dto';
import { PrismaService } from '../services/prisma.service';
import { ProductRepository } from './product.repository';
import { Decimal, JsonValue } from '@prisma/client/runtime/library';

type OrderProps = {
  id: string;
  items: JsonValue | Item[];
  total: Decimal;
  status: OrderStatus;
};

@Injectable()
export class OrderRepository {
  private orm: PrismaService['order'];

  constructor(
    private prisma: PrismaService,
    private productRepository: ProductRepository,
  ) {
    this.orm = this.prisma.order;
  }

  async create(order: OrderEntity) {
    return this.prisma.$transaction(async (tx) => {
      const items = await Promise.all(
        order.items.map(async (item) => {
          await this.productRepository.decrementStockQuantity(
            item.product.id,
            item.quantity,
          );

          return { quantity: item.quantity, productId: item.product.id };
        }),
      );

      const created = await tx.order.create({
        data: {
          items,
          total: order.total,
          status: order.status,
        },
      });

      return this.parseToEntity(created);
    });
  }

  async findById(id: string) {
    const order = await this.orm.findUnique({
      where: { id },
    });

    if (!order) return;

    const items = order.items as Array<{ productId: string; quantity: number }>;

    const itemsMapped = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepository.findById(item.productId);

        return { product: product?.toData(), quantity: item.quantity };
      }) as unknown as Array<{ productId: string; quantity: number }>,
    );

    return this.parseToEntity({ ...order, items: itemsMapped });
  }

  async findAll() {
    const orders = await this.orm.findMany();

    return Promise.all(
      orders.map(async (order) => {
        const items = order.items as { productId: string; quantity: number }[];
        const productIds = items.map((item) => item.productId);

        const products = await this.productRepository.findMany(productIds);

        const updatedItems = items.map((item) => ({
          quantity: item.quantity,
          product: products
            .find((product) => product.id === item.productId)
            ?.toData(),
        }));

        return this.parseToEntity({ ...order, items: updatedItems });
      }),
    );
  }

  async update(id: string, data: UpdateOrderStatusDto) {
    const order = await this.orm.update({
      data: {
        status: data.status,
      },
      where: { id },
    });

    return this.parseToEntity(order);
  }

  private parseToEntity(data: OrderProps) {
    return new OrderEntity({
      ...data,
      total: Number(data.total),
      items: data.items as Item[],
    });
  }
}
