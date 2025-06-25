import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

// HTTP connection to the API
const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
    credentials: 'include', // Если нужны куки
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

// Authorization header if needed
const authLink = setContext((_, { headers }) => {
    // Получите токен аутентификации, если он есть
    const token = localStorage.getItem('auth-token')
    console.log('token', token);

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
})

// Cache implementation
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                localField: {
                    read() {
                        return 'Local value'
                    },
                },
            },
        },
    },
})

// Create the apollo client
export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    link: httpLink,
    cache,
})
