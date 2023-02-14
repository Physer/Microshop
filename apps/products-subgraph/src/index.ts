import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Repository } from './repository.js';
import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';

const repository = new Repository();
const resolvers = {
  Query: {
    products: async () => await repository.getProducts(),
  },
  Mutation: {
    seedProductData: async () => await repository.seed(),
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
  listen: { port: 3001 },
});

console.log(`🚀  Server ready at: ${url}`);
