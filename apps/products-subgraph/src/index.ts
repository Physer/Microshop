import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Repository } from './repository.js';

const typeDefs = `#graphql
  type Product {
    name: String
    description: String
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    seedProductData: Boolean
  }
`;

const repository = new Repository();
const resolvers = {
  Query: {
    products: () => async () => await repository.getProducts(),
  },
  Mutation: {
    seedProductData: async () => await repository.seed(),
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
