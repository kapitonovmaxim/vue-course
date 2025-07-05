import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
    credentials: 'include', // Если нужны куки
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

const authLink = setContext((_, { headers }) => {
    // const token = localStorage.getItem('auth-token')

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
})

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

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    link: httpLink,
    cache,
})
