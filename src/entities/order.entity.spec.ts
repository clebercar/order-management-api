import { OrderEntity, OrderStatus, Item } from './order.entity';
import { ProductEntity } from './product.entity';

describe('OrderEntity', () => {
  let mockProduct: ProductEntity;
  let mockItem: Item;

  beforeEach(() => {
    mockProduct = {
      id: 'product-1',
      name: 'Test Product',
      price: 100,
      stockQuantity: 10,
    } as ProductEntity;

    mockItem = {
      product: mockProduct,
      quantity: 2,
    };
  });

  describe('constructor', () => {
    it('should create an order with default values', () => {
      const order = new OrderEntity();
      expect(order.id).toBeUndefined();
      expect(order.status).toBe('pending');
      expect(order.total).toBe(0);
      expect(order.items).toEqual([]);
    });

    it('should create an order with provided values', () => {
      const order = new OrderEntity({
        id: 'order-1',
        items: [mockItem],
        total: 200,
        status: 'completed' as OrderStatus,
      });

      expect(order.id).toBe('order-1');
      expect(order.items).toEqual([mockItem]);
      expect(order.total).toBe(200);
      expect(order.status).toBe('completed');
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const order = new OrderEntity({ id: 'order-1' });
      expect(order.id).toBe('order-1');
    });

    it('should return correct total', () => {
      const order = new OrderEntity({ total: 500 });
      expect(order.total).toBe(500);
    });

    it('should return correct status', () => {
      const order = new OrderEntity({ status: 'completed' });
      expect(order.status).toBe('completed');
    });

    it('should return a copy of items array', () => {
      const order = new OrderEntity({ items: [mockItem] });
      const items = order.items;
      expect(items).toEqual([mockItem]);
      items.push(mockItem);
      expect(order.items).toHaveLength(1);
    });
  });

  describe('addItem', () => {
    it('should add item and update total', () => {
      const order = new OrderEntity();
      order.addItem(mockItem);

      expect(order.items).toHaveLength(1);
      expect(order.items[0]).toEqual(mockItem);
      expect(order.total).toBe(mockProduct.price * mockItem.quantity);
    });

    it('should maintain immutability of items array', () => {
      const order = new OrderEntity();
      order.addItem(mockItem);
      const items = order.items;
      items.push(mockItem);

      expect(order.items).toHaveLength(1);
    });
  });

  describe('updateStatus', () => {
    it('should update to a valid status', () => {
      const order = new OrderEntity();
      order.updateStatus('completed');
      expect(order.status).toBe('completed');
    });

    it('should throw an error for an invalid status', () => {
      const order = new OrderEntity();
      expect(() => {
        order.updateStatus('invalid-status' as OrderStatus);
      }).toThrow('Invalid order status');
    });
  });

  describe('toData', () => {
    it('should return order data without methods', () => {
      const order = new OrderEntity({
        id: 'order-1',
        items: [mockItem],
        total: 200,
        status: 'completed' as OrderStatus,
      });

      const data = order.toData();
      expect(data).toEqual({
        id: 'order-1',
        items: [mockItem],
        total: 200,
        status: 'completed',
      });

      expect('addItem' in data).toBe(false);
      expect('updateStatus' in data).toBe(false);
      expect('toData' in data).toBe(false);
    });

    it('should return a new instance of items array', () => {
      const order = new OrderEntity({ items: [mockItem] });
      const data = order.toData();
      data.items.push(mockItem);
      expect(order.items).toHaveLength(1);
    });
  });
});
