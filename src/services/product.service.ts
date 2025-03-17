import { Injectable, NotFoundException } from '@nestjs/common';

import { ProductEntity } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async create(data: CreateProductDto) {
    const product = await this.productRepository.create(
      new ProductEntity(data),
    );

    return product.toData();
  }

  async list() {
    const products = await this.productRepository.findAll();

    return products.map((product) => product.toData());
  }

  async details(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);

    return product.toData();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.update(id, updateProductDto);

    return product.toData();
  }

  async remove(id: string) {
    await this.productRepository.delete(id);
  }
}
