import { join } from 'path';
import { faker } from '@faker-js/faker';
import type { Product } from './types/product.type';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

type Data = {
  products: Product[];
};

class Repository {
  private readonly database: Low<Data>;

  constructor() {
    const file = join(__dirname, 'db.json');
    const adapter = new JSONFile<Data>(file);
    this.database = new Low(adapter);
  }

  getMany<T>(): Array<T> {
    return [];
  }

  seed(numberOfRecords = 1000) {
    const products: Array<Product> = [];
    Array.from({ length: numberOfRecords }).forEach(() => {
      products.push(this.generateFakeProduct());
    });
    this.database.data.products = products;
  }

  private generateFakeProduct(): Product {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    };
  }
}
