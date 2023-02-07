import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { Repository } from './repository.js';

const repository = new Repository();
const resolvers = {
  Query: {
    prices: async () => await repository.getProducts(),
  },
  Mutation: {
    seedPricingData: async () => await repository.seed(),
  },
};

const typeDefs = readFileSync('../../schemas/pricing.graphql', {
  encoding: 'utf-8',
});
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
