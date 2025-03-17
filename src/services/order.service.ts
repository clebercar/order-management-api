import { Injectable, BadRequestException } from '@nestjs/common';

import { EOrderStatus, OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/order.dto';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = new OrderEntity();

    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new BadRequestException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`,
        );
      }

      order.addItem({
        product,
        quantity: item.quantity,
      });
    }

    const orderCreated = await this.orderRepository.create(order);

    return orderCreated.toData();
  }

  async list() {
    const orders = await this.orderRepository.findAll();

    return orders.map((order) => order.toData());
  }

  async details(id: string) {
    const order = await this.orderRepository.findById(id);

    if (!order) throw new BadRequestException(`Order with ID ${id} not found`);

    return order.toData();
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findById(id);

    if (!order) throw new BadRequestException(`Order with ID ${id} not found`);

    if (updateOrderStatusDto.status === EOrderStatus.cancelled)
      await this.updateProductStock(order, 'increment');

    const orderUpdated = await this.orderRepository.update(
      id,
      updateOrderStatusDto,
    );

    return orderUpdated.toData();
  }

  private async updateProductStock(
    order: Omit<OrderEntity, 'toData' | 'addItem' | 'updateStatus'>,
    action: 'decrement' | 'increment',
  ) {
    for (const { product, quantity } of order.items) {
      if (action === 'increment')
        await this.productRepository.incrementStockQuantity(
          product.id,
          quantity,
        );
    }
  }
}
