import { faker } from '@faker-js/faker';
import type { Product } from './types/product.type.js';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

type Data = {
  products: Product[];
};

export class Repository {
  private readonly database: Low<Data>;

  constructor() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = join(__dirname, 'db.json');
    console.log(file);
    const adapter = new JSONFile<Data>(file);
    this.database = new Low(adapter);
  }

  async getProducts(): Promise<Array<Product>> {
    await this.database.read();
    return this.database.data.products || [];
  }

  async seed(numberOfRecords = 1000): Promise<boolean> {
    const products: Array<Product> = [];
    Array.from({ length: numberOfRecords }).forEach(() => {
      products.push(this.generateFakeProduct());
    });
    this.database.data = {
      products: products,
    };
    await this.database.write();
    return true;
  }

  private generateFakeProduct(): Product {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      id: randomUUID()
    };
  }
}
