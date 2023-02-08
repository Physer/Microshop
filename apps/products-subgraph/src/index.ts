import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Repository } from './repository.js';
import { readFileSync } from 'fs';

const repository = new Repository();
const resolvers = {
  Query: {
    products: async () => await repository.getProducts(),
  },
  Mutation: {
    seedProductData: async () => await repository.seed(),
  },
};

const typeDefs = readFileSync('./schema.graphql', {
  encoding: 'utf-8',
});
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
const { url } = await startStandaloneServer(server, {
  listen: { port: 3001 },
});

console.log(`🚀  Server ready at: ${url}`);
