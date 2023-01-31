import { PrismaClient } from '../../node_modules/.prisma/client';

export async function GetProducts(): Promise<Array<Product>> {
  const prismaClient = new PrismaClient();

  return [];
}
