// frontend/lib/ApolloWrapper.js
'use client';

import { ApolloProvider } from '@apollo/client';
// import client from './apolloClient';
// import client from './apolloClient'
import client from './ApolloClienttt';
export default function ApolloWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}


