const { GraphQLServer } = require('graphql-yoga');
const data = require('./access');

const typeDefs = `
  type Query {
    KPIs: KPI,
    resourceUsage: ResourceUsage
  }
  type KPI {
    PPT: Float,
    PT: Float,
    FT: Float,
    FP: Int,
    RP: Int
  }
  type ResourceUsage {
    resource: [Resource],
    total: Int
  }
  type Resource {
    Count: Int,
    ResourceID: ID,
    Description: String,
    ResourceName: String
  }
`;

const resolvers = {
  Query: {
    KPIs: () => data.getKPIs(),
    resourceUsage: () => data.getResourceCount()
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'))
