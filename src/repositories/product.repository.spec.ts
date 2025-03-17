import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/library';

import { ProductRepository } from './product.repository';

import { PrismaService } from '../services/prisma.service';
import { ProductEntity } from '../entities/product.entity';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let prisma: PrismaService;

  const product = new ProductEntity({
    id: 'prod-1',
    name: 'Test Product',
    category: 'Category',
    description: 'Description',
    price: 100,
    stockQuantity: 10,
  });

  const productPrisma = {
    ...product.toData(),
    price: product.price as unknown as Decimal,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      jest.spyOn(prisma.product, 'create').mockResolvedValue(productPrisma);

      const result = await productRepository.create(product);

      expect(result).toEqual(product);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: product.toData(),
      });
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      jest.spyOn(prisma.product, 'update').mockResolvedValue(productPrisma);

      const result = await productRepository.update(product.id, {
        name: 'Updated Product',
      });

      expect(result).toEqual(product);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: product.id },
        data: { name: 'Updated Product' },
      });
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      jest.spyOn(prisma.product, 'delete').mockResolvedValue(productPrisma);

      await expect(productRepository.delete('prod-1')).resolves.toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return a product by ID', async () => {
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(productPrisma);

      expect(await productRepository.findById('prod-1')).toEqual(product);
    });

    it('should return null if product is not found', async () => {
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(null);

      expect(await productRepository.findById('prod-1')).toEqual(undefined);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      jest.spyOn(prisma.product, 'findMany').mockResolvedValue([productPrisma]);

      expect(await productRepository.findAll()).toEqual([product]);
    });

    it('should return an empty array if no products are found', async () => {
      jest.spyOn(prisma.product, 'findMany').mockResolvedValue([]);

      expect(await productRepository.findAll()).toEqual([]);
    });
  });

  describe('decrementStockQuantity', () => {
    it('should decrement stock quantity', async () => {
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(productPrisma);
      jest.spyOn(prisma.product, 'update').mockResolvedValue(productPrisma);

      await productRepository.decrementStockQuantity('prod-1', 5);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: {
          stockQuantity: {
            decrement: 5,
          },
        },
      });
    });
  });

  describe('incrementStockQuantity', () => {
    it('should increment stock quantity', async () => {
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(productPrisma);
      jest.spyOn(prisma.product, 'update').mockResolvedValue(productPrisma);

      await productRepository.incrementStockQuantity('prod-1', 5);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: {
          stockQuantity: {
            increment: 5,
          },
        },
      });
    });
  });

  describe('findMany', () => {
    it('should return products by IDs', async () => {
      jest.spyOn(prisma.product, 'findMany').mockResolvedValue([productPrisma]);

      expect(await productRepository.findMany(['prod-1'])).toEqual([product]);
    });

    it('should return an empty array if no products are found', async () => {
      jest.spyOn(prisma.product, 'findMany').mockResolvedValue([]);

      expect(await productRepository.findMany(['prod-1'])).toEqual([]);
    });
  });
});
