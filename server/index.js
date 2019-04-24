const { GraphQLServer } = require('graphql-yoga');
const data = require('./access');

const typeDefs = `
  type Query {
    hello(name: String): String!
    times: [TimeDiff],
    resourceUsage: [ResourceUsage]
  }
  type TimeDiff {
    ONo: ID,
    timeTaken: String
  }
  type ResourceUsage {
    count: Int,
    ResourceID: Int,
    Description: String,
    total: [Total]
  }
  type Total {
    total: Int
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    times: () => data.try(),
    resourceUsage: () => data.getResourceCount()
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'))
