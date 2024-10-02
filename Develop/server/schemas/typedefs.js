const { gql } = require('graphql-tag');

const typeDefs = gql`
  # Define the Book type
  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # Define the User type
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  # Define the Auth type for login
  type Auth {
    token: ID!
    user: User
  }

  # Define the queries
  type Query {
    me: User
    getBooks(searchTerm: String!): [Book]
  }

  # Define the mutations
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: String!, authors: [String], description: String, title: String, image: String, link: String): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;