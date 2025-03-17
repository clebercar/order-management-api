import { ProductEntity } from './product.entity';

describe('ProductEntity', () => {
  let productData: {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
  };

  beforeEach(() => {
    productData = {
      id: 'prod-123',
      name: 'Laptop',
      price: 1299.99,
      category: 'Electronics',
      description: 'High-end gaming laptop',
    };
  });

  describe('constructor', () => {
    it('should create a product with provided values', () => {
      const product = new ProductEntity(productData);
      expect(product.id).toBe(productData.id);
      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.category).toBe(productData.category);
      expect(product.description).toBe(productData.description);
    });

    it('should create a product with default values if no data is provided', () => {
      const product = new ProductEntity();
      expect(product.id).toBeUndefined();
      expect(product.name).toBeUndefined();
      expect(product.price).toBeUndefined();
      expect(product.category).toBeUndefined();
      expect(product.description).toBeUndefined();
    });
  });

  describe('getters', () => {
    it('should return correct values', () => {
      const product = new ProductEntity(productData);
      expect(product.id).toBe('prod-123');
      expect(product.name).toBe('Laptop');
      expect(product.price).toBe(1299.99);
      expect(product.category).toBe('Electronics');
      expect(product.description).toBe('High-end gaming laptop');
    });
  });

  describe('toData', () => {
    it('should return product data as a plain object', () => {
      const product = new ProductEntity(productData);
      const data = product.toData();
      expect(data).toEqual({
        id: 'prod-123',
        name: 'Laptop',
        price: 1299.99,
        category: 'Electronics',
        description: 'High-end gaming laptop',
        stockQuantity: undefined,
      });
    });
  });
});
