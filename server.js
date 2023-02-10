const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { json } = require('body-parser');
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

const startServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    app.get("/test", (req, res) => {
        res.json({
            message: "Rest Api"
        })
    })
    app.use(
        '/graphql',
        cors(),
        json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({ token: req.headers.token }),
        }),
    );
    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 GrapQl Server ready at http://localhost:4000/graphql`);
    console.log(`🚀 Express Server ready at http://localhost:4000/`);
}

try {
    startServer();
} catch (error) {
    console.log(` 🧨  error`, error);
}
