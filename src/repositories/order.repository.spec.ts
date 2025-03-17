import { Test, TestingModule } from '@nestjs/testing';
import { Decimal, JsonValue } from '@prisma/client/runtime/library';

import { OrderRepository } from './order.repository';
import { ProductRepository } from './product.repository';

import { Item } from '../entities/order.entity';
import { ProductEntity } from '../entities/product.entity';
import { PrismaService } from '../services/prisma.service';
import { EOrderStatus, OrderEntity } from '../entities/order.entity';

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  let prisma: PrismaService;
  let productRepository: ProductRepository;

  const product = new ProductEntity({
    id: 'prod-1',
    category: 'category-1',
    name: 'Product 1',
    price: 100,
  });

  const order = new OrderEntity({
    items: [{ product, quantity: 2 } as Item],
    total: 200,
    status: 'completed',
  });

  const prismaOrder = {
    ...order.toData(),
    items: order.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })) as unknown as JsonValue,
    total: order.total as unknown as Decimal,
  };

  const create = jest.fn().mockReturnValue(prismaOrder);
  const transactionCallback = jest.fn((cb) => cb({ order: { create } }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: PrismaService,
          useValue: {
            order: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },

            $transaction: transactionCallback,
          },
        },
        {
          provide: ProductRepository,
          useValue: {
            findById: jest.fn(),
            findMany: jest.fn(),
            decrementStockQuantity: jest.fn(),
          },
        },
      ],
    }).compile();

    orderRepository = module.get<OrderRepository>(OrderRepository);
    prisma = module.get<PrismaService>(PrismaService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      jest
        .spyOn(productRepository, 'decrementStockQuantity')
        .mockResolvedValue(undefined);

      const result = await orderRepository.create(order);

      expect(result).toEqual({
        ...order,
        _items: [{ productId: 'prod-1', quantity: 2 }],
      });
      expect(create).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return an order by ID', async () => {
      jest.spyOn(productRepository, 'findById').mockResolvedValue(product);

      jest.spyOn(prisma.order, 'findUnique').mockResolvedValue(prismaOrder);

      const result = await orderRepository.findById('order-1');

      expect(result).toEqual({
        ...order,
        _items: [{ product: product.toData(), quantity: 2 }],
      });
    });

    it('should return undefined if order is not found', async () => {
      jest.spyOn(prisma.order, 'findUnique').mockResolvedValue(null);

      const result = await orderRepository.findById('order-1');

      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const order = new OrderEntity({
        items: [{ product: product.toData(), quantity: 2 } as Item],
        total: 200,
        status: 'completed',
      });

      jest.spyOn(productRepository, 'findMany').mockResolvedValue([product]);
      jest.spyOn(prisma.order, 'findMany').mockResolvedValue([prismaOrder]);

      expect(await orderRepository.findAll()).toEqual([order]);
    });
  });

  describe('update', () => {
    it('should update an order status', async () => {
      jest.spyOn(prisma.order, 'update').mockResolvedValue(prismaOrder);

      const result = await orderRepository.update(order.id, {
        status: EOrderStatus.completed,
      });

      expect(result).toEqual({
        ...order,
        _items: [{ productId: 'prod-1', quantity: 2 }],
      });
    });
  });
});
