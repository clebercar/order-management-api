import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from './order.service';

import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';

import { ProductEntity } from '../entities/product.entity';
import { EOrderStatus, OrderEntity } from '../entities/order.entity';

import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/order.dto';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository;
  let productRepository: ProductRepository;

  const order = new OrderEntity({
    id: 'order-1',
    status: 'pending',
    items: [
      {
        product: new ProductEntity({
          id: 'prod-1',
          name: 'Product 1',
          price: 100,
          category: 'eletronics',
          description: 'A high-end gaming laptop with RGB keyboard.',
          stockQuantity: 3,
        }),
        quantity: 2,
      },
    ],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ProductRepository,
          useValue: {
            findById: jest.fn(),
            decrementStockQuantity: jest.fn(),
            incrementStockQuantity: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ productId: 'prod-1', quantity: 2 }],
      };

      const product = new ProductEntity({
        id: 'prod-1',
        name: 'Product 1',
        price: 100,
        category: 'eletronics',
        description: 'A high-end gaming laptop with RGB keyboard.',
        stockQuantity: 3,
      });

      jest.spyOn(productRepository, 'findById').mockResolvedValue(product);

      const order = new OrderEntity({
        items: [
          {
            product,
            quantity: 2,
          },
        ],
        status: EOrderStatus.pending,
        total: 200,
      });

      jest.spyOn(orderRepository, 'create').mockResolvedValue(order);

      const result = await orderService.create(createOrderDto);

      expect(result).toEqual(order.toData());
      expect(orderRepository.create).toHaveBeenCalledWith(order);
    });

    it('should throw an error if product does not exist', async () => {
      jest.spyOn(productRepository, 'findById').mockResolvedValue(undefined);

      const createOrderDto: CreateOrderDto = {
        items: [{ productId: 'invalid-id', quantity: 2 }],
      };

      await expect(orderService.create(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if product stock is insufficient', async () => {
      const product = new ProductEntity({
        id: 'prod-1',
        name: 'Product 1',
        price: 100,
        category: 'eletronics',
        description: 'A high-end gaming laptop with RGB keyboard.',
        stockQuantity: 1,
      });

      jest.spyOn(productRepository, 'findById').mockResolvedValue(product);

      const createOrderDto: CreateOrderDto = {
        items: [{ productId: 'prod-1', quantity: 2 }],
      };

      await expect(orderService.create(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('list', () => {
    it('should return all orders', async () => {
      jest.spyOn(orderRepository, 'findAll').mockResolvedValue([order]);
      expect(await orderService.list()).toEqual([order.toData()]);
    });
  });

  describe('details', () => {
    it('should return an order by ID', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);

      expect(await orderService.details('order-1')).toEqual(order.toData());
    });

    it('should throw an error if order is not found', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(undefined);

      await expect(orderService.details('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an order', async () => {
      const order = new OrderEntity({ id: 'order-1', status: 'pending' });

      const updateOrderStatusDto: UpdateOrderStatusDto = {
        status: EOrderStatus.completed,
      };

      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);

      const updatedOrder = new OrderEntity({
        ...order.toData(),
        status: 'completed',
      });

      jest.spyOn(orderRepository, 'update').mockResolvedValue(updatedOrder);

      const result = await orderService.updateStatus(
        'order-1',
        updateOrderStatusDto,
      );
      expect(result.status).toBe('completed');
    });

    it('should throw an error if order is not found', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(undefined);

      const updateOrderStatusDto: UpdateOrderStatusDto = {
        status: EOrderStatus.completed,
      };

      await expect(
        orderService.updateStatus('invalid-id', updateOrderStatusDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should increment product stock quantity when order is cancelled', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);

      const updateOrderStatusDto: UpdateOrderStatusDto = {
        status: EOrderStatus.cancelled,
      };

      const updatedOrder = new OrderEntity({
        ...order.toData(),
        status: 'cancelled',
      });

      jest.spyOn(orderRepository, 'update').mockResolvedValue(updatedOrder);

      await orderService.updateStatus('order-1', updateOrderStatusDto);

      expect(productRepository.incrementStockQuantity).toHaveBeenCalledWith(
        'prod-1',
        2,
      );
    });
  });
});
