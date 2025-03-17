import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from './product.entity';

export enum EOrderStatus {
  pending = 'pending',
  completed = 'completed',
  cancelled = 'cancelled',
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export type Item = {
  product: ProductEntity;
  quantity: number;
};

export type OrderAttributes = {
  id: string;
  items: Item[];
  total: number;
  status: OrderStatus;
};

export class OrderEntity {
  @ApiProperty()
  private readonly _id: string;

  @ApiProperty()
  private _items: Item[] = [];

  @ApiProperty()
  private _total: number = 0;

  @ApiProperty()
  private _status: OrderStatus = 'pending';

  constructor(data: Partial<OrderAttributes> = {}) {
    const { id, items, status, total } = data;

    if (id) this._id = id;
    if (items) this._items = items;
    if (total) this._total = total;
    if (status) this._status = status;
  }

  get id(): string {
    return this._id;
  }

  get items(): Item[] {
    return [...this._items];
  }

  get total(): number {
    return this._total;
  }

  get status(): OrderStatus {
    return this._status;
  }

  public addItem(item: Item): void {
    this._items.push(item);
    this._total += item.product.price * item.quantity;
  }

  public updateStatus(newStatus: OrderStatus): void {
    if (!Object.values(EOrderStatus).includes(newStatus as EOrderStatus))
      throw new Error('Invalid order status');

    this._status = newStatus;
  }

  public toData(): Omit<OrderEntity, 'toData' | 'addItem' | 'updateStatus'> {
    return {
      id: this._id,
      items: [...this._items],
      total: this._total,
      status: this._status,
    };
  }
}
