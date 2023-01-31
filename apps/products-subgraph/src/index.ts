import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Repository } from './repository.js';
import { Product } from './types/product.type.js';

const typeDefs = `#graphql
  type Product {
    name: String
    description: String
  }

  type Query {
    products: [Product]
  }
`;

const products: Array<Product> = [
  {
    name: 'Bakkersrekje',
    description: 'Het ultieme bakelement',
  },
  {
    name: 'Accubak',
    description: 'Een geweldige accubak',
  },
];

const repository = new Repository();
const resolvers = {
  Query: {
    products: () => products,
  },
  Mutation: {
    products: () => repository.seed(),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
