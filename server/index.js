const { GraphQLServer } = require('graphql-yoga');
const data = require('./access');

const typeDefs = `
  type Query {
    KPIs: KPI,
    resourceUsage: ResourceUsage
  }
  type KPI {
    ICT: Int,
    ACT: Int,
    PPT: Int,
    PT: [Process],
    FT: Float,
    FP: Int,
    RP: Int
  }
  type Process {
    pt: Float,
    description: String
  }
  type ResourceUsage {
    resource: [Resource],
  }
  type Resource {
    TotalTime: Float,
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
