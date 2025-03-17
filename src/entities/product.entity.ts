import { ApiProperty } from '@nestjs/swagger';

export type ProductAttributes = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  stockQuantity: number;
};

export class ProductEntity {
  @ApiProperty()
  private _id: string;

  @ApiProperty()
  private _name: string;

  @ApiProperty()
  private _category: string;

  @ApiProperty()
  private _description: string;

  @ApiProperty()
  private _price: number;

  @ApiProperty()
  private _stockQuantity: number;

  constructor(data: Partial<ProductAttributes> = {}) {
    const { id, category, description, name, price, stockQuantity } = data;

    if (id) this._id = id;
    if (name) this._name = name;
    if (price) this._price = price;
    if (category) this._category = category;
    if (description) this._description = description;
    if (stockQuantity) this._stockQuantity = stockQuantity;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get category(): string {
    return this._category;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get stockQuantity(): number {
    return this._stockQuantity;
  }

  toData() {
    return {
      id: this._id,
      name: this._name,
      category: this._category,
      description: this._description,
      price: this._price,
      stockQuantity: this._stockQuantity,
    };
  }
}
