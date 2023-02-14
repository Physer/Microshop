import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { Repository } from './repository.js';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';

const repository = new Repository();
const resolvers = {
  Query: {
    prices: async () => await repository.getPrices(),
  },
  Mutation: {
    seedPricingData: async () => await repository.seed(),
  },
};

const schema = readFileSync('./schema.graphql', {
  encoding: 'utf-8',
});
const typeDefs = gql(schema);
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
const { url } = await startStandaloneServer(server, {
  listen: { port: 3002 },
});

console.log(`🚀  Server ready at: ${url}`);
