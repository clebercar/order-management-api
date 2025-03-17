import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from './product.service';
import { ProductEntity } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  const product = new ProductEntity({
    id: '1',
    name: 'Test Product',
    category: 'Test Category',
    description: 'Test Description',
    price: 100,
    stockQuantity: 10,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        category: 'Test Category',
        description: 'Test Description',
        price: 100,
        stockQuantity: 10,
      };

      const product = new ProductEntity(createProductDto);

      jest.spyOn(productRepository, 'create').mockResolvedValue(product);

      const result = await productService.create(createProductDto);

      expect(result).toEqual(product.toData());
      expect(productRepository.create).toHaveBeenCalledWith(
        expect.any(ProductEntity),
      );
    });
  });

  describe('list', () => {
    it('should return all products', async () => {
      jest.spyOn(productRepository, 'findAll').mockResolvedValue([product]);

      expect(await productService.list()).toEqual([product.toData()]);
    });
  });

  describe('details', () => {
    it('should return a product by ID', async () => {
      const product = new ProductEntity({ id: '1', name: 'Test Product' });

      jest.spyOn(productRepository, 'findById').mockResolvedValue(product);

      expect(await productService.details('1')).toEqual(product.toData());
    });

    it('should return null if product not found', async () => {
      jest.spyOn(productRepository, 'findById').mockResolvedValue(undefined);

      await expect(productService.details('1')).rejects.toEqual(
        new NotFoundException(`Product with ID 1 not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = { name: 'Updated Product' } as UpdateProductDto;

      const updatedProduct = new ProductEntity({
        id: '1',
        ...updateProductDto,
      });

      jest.spyOn(productRepository, 'update').mockResolvedValue(updatedProduct);

      const result = await productService.update('1', updateProductDto);

      expect(result).toEqual(updatedProduct.toData());
      expect(productRepository.update).toHaveBeenCalledWith(
        '1',
        updateProductDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(productRepository, 'delete').mockResolvedValue(undefined);

      await expect(productService.remove('1')).resolves.toBeUndefined();

      expect(productRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
