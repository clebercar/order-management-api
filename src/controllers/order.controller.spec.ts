import { Test, TestingModule } from '@nestjs/testing';

import { OrderController } from './order.controller';

import { OrderService } from '../services/order.service';
import { ProductEntity } from '../entities/product.entity';
import { EOrderStatus, OrderEntity } from '../entities/order.entity';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  const product = new ProductEntity({
    id: 'prod-1',
    price: 50,
    name: 'product',
    stockQuantity: 10,
    category: 'category',
    description: 'description',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            list: jest.fn(),
            details: jest.fn(),
            create: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  describe('index', () => {
    it('should return all orders', async () => {
      jest.spyOn(orderService, 'list').mockResolvedValue([]);
      expect(await orderController.index()).toEqual([]);
    });
  });

  describe('show', () => {
    it('should return an order by ID', async () => {
      const order = new OrderEntity({
        id: 'order-1',
        items: [{ product, quantity: 2 }],
        total: 100,
        status: 'pending',
      });

      jest.spyOn(orderService, 'details').mockResolvedValue(order);

      expect(await orderController.show('order-1')).toEqual(order);
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        items: [{ productId: 'prod-1', quantity: 2 }],
      };

      const order = new OrderEntity({
        id: 'order-1',
        status: 'pending',
        items: [{ product: product, quantity: 2 }],
        total: 100,
      }).toData();

      jest.spyOn(orderService, 'create').mockResolvedValue({
        id: 'order-1',
        total: 100,
        status: 'pending',
        items: [{ product, quantity: 2 }],
      });

      expect(await orderController.create(createOrderDto)).toEqual(order);
    });
  });

  describe('update', () => {
    it('should update an order status', async () => {
      const updateOrderStatusDto = {
        status: EOrderStatus.completed,
      };

      const updatedOrder = new OrderEntity({
        id: 'order-1',
        status: 'completed',
        items: [{ product: product, quantity: 2 }],
        total: 100,
      }).toData();

      jest.spyOn(orderService, 'updateStatus').mockResolvedValue({
        id: 'order-1',
        status: 'completed',
        items: [{ product: product, quantity: 2 }],
        total: 100,
      });

      expect(
        await orderController.update('order-1', updateOrderStatusDto),
      ).toEqual(updatedOrder);
    });
  });
});
