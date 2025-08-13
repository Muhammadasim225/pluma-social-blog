// lib/apolloClient.js or wherever your client is
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include', // ✅ Send cookies with every request
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
