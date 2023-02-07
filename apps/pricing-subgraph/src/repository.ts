import { faker } from '@faker-js/faker';
import type { Price } from './types/price.type.js';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

type Data = {
  prices: Price[];
};

export class Repository {
  private readonly database: Low<Data>;

  constructor() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = join(__dirname, 'prices.json');
    const adapter = new JSONFile<Data>(file);
    this.database = new Low(adapter);
  }

  async getProducts(): Promise<Array<Price>> {
    await this.database.read();
    return this.database?.data?.prices || [];
  }

  async seed(numberOfRecords = 1000): Promise<boolean> {
    const prices: Array<Price> = [];
    let productId = 1;
    Array.from({ length: numberOfRecords }).forEach(() => {
      prices.push(this.generateFakePrice(productId));
      productId++;
    });
    this.database.data = {
      prices: prices,
    };
    await this.database.write();
    return true;
  }

  private generateFakePrice(productId: number): Price {
    return {
      id: randomUUID(),
      price: faker.commerce.price(),
      productId: productId,
    };
  }
}
