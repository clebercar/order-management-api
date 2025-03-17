import { Test, TestingModule } from '@nestjs/testing';

import { ProductController } from './product.controller';
import { ProductService } from '../services/product.service';
import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from 'src/dto/product.dto';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

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
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            list: jest.fn(),
            details: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('index', () => {
    it('should return all products', async () => {
      jest.spyOn(productService, 'list').mockResolvedValue([product.toData()]);

      expect(await productController.index()).toEqual([product.toData()]);
    });
  });

  describe('show', () => {
    it('should return a product by ID', async () => {
      jest.spyOn(productService, 'details').mockResolvedValue(product);
      expect(await productController.show('prod-1')).toEqual(product);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        name: 'product',
        price: 50,
        stockQuantity: 10,
        category: 'category',
        description: 'description',
      };

      jest
        .spyOn(productService, 'create')
        .mockResolvedValue({ id: 'prod-1', ...createProductDto });

      expect(await productController.create(createProductDto)).toEqual({
        id: 'prod-1',
        ...createProductDto,
      });
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: CreateProductDto = {
        name: 'updated product',
        category: 'category',
        description: 'description',
        price: 50,
        stockQuantity: 10,
      };

      const updatedProduct = new ProductEntity({
        ...product,
        name: 'updated product',
      });

      jest.spyOn(productService, 'update').mockResolvedValue(updatedProduct);

      expect(
        await productController.update('prod-1', updateProductDto),
      ).toEqual(updatedProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      jest.spyOn(productService, 'remove').mockResolvedValue(undefined);
      await expect(productController.delete('prod-1')).resolves.toBeUndefined();
    });
  });
});
