import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

// HTTP link
const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

// WebSocket link
const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://localhost:5000/graphql',
    connectionParams: () => {
        const token = localStorage.getItem('auth-token')
        return { authorization: token ? `Bearer ${token}` : '' }
    },
    shouldRetry: () => true, // Автоматически переподключаться
    retryAttempts: Infinity, // Бесконечные попытки переподключения
    retryWait: async (retries) => {
        // Экспоненциальная задержка
        const delay = Math.min(1000 * 2 ** retries, 30000)
        await new Promise(resolve => setTimeout(resolve, delay))
        return delay
    },
    keepAlive: 10000
}))

// Auth link
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('auth-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
})

// Split link - WebSocket for subscriptions, HTTP for everything else
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    authLink.concat(httpLink)
)

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
    link: splitLink,
    cache,
})