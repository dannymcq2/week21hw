const express = require('express'); // Express.js framework
const { ApolloServer } = require('@apollo/server'); // Apollo Server v4
const { expressMiddleware } = require('@apollo/server/express4'); // Apollo middleware for Express.js
const { typeDefs, resolvers } = require('./schemas'); // GraphQL schema definitions and resolvers
const db = require('./config/connection'); // MongoDB connection setup
const path = require('path'); // For serving static assets
const { authMiddleware } = require('./utils/auth'); // Custom auth middleware for token validation
const cors = require('cors'); // To handle cross-origin requests
const bodyParser = require('body-parser'); // To parse incoming request bodies
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to handle CORS and body parsing
app.use(cors());
app.use(bodyParser.json()); // ApolloServer v4 requires body-parser to handle JSON requests

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server and apply middleware to Express
async function startApolloServer() {
  await server.start();

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware, // Auth middleware for passing user context
  }));

 // Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist'))); // Change 'build' to 'dist'

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html')); // Change 'build' to 'dist'
  });
}

  // Start the server after the database connection is open
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`);
    });
  });
}

// Start the Apollo server
startApolloServer();