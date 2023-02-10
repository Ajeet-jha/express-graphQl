const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
require('dotenv').config();

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

const typeDefs = `
    type Book {
        title: String
        author: String
    }
    type Query {
        books: [Book]
    }
  `;
const resolvers = {
    Query: {
        books: () => books,
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startServer = async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
}

try {
    startServer();
} catch (error) {
    console.log(` 🧨  error`, error);
}
