import { faker } from '@faker-js/faker';
import type { Product } from './types/product.type.js';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { dirname } from 'path';

type Data = {
  products: Product[];
};

export class Repository {
  private readonly database: Low<Data>;

  constructor() {
    const file = dirname('db.json');
    const adapter = new JSONFile<Data>(file);
    this.database = new Low(adapter);
  }

  getMany<T>(): Array<T> {
    return [];
  }

  seed(numberOfRecords = 1000): boolean {
    const products: Array<Product> = [];
    Array.from({ length: numberOfRecords }).forEach(() => {
      products.push(this.generateFakeProduct());
    });
    this.database.data = {
      products: products
    }
    return true;
  }

  private generateFakeProduct(): Product {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    };
  }
}
