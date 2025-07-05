import express from 'express'
import { createServer } from 'http'
import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import cors from 'cors'
import axios from 'axios'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

const app = express()

// CORS middleware
app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    })
)

app.use(express.json()) // Это добавит Content-Type: application/json
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Accept', 'application/json')
  next()
})

// Build schema with subscription support
const schema = buildSchema(`
    type Query {
        message: String
        products: ProductsResponse
        product(id: ID!): Product
    }

    type Subscription {
		productUpdated(id: ID!): Product
	}

    type Product {
        id: ID!
        title: String!
        description: String
        price: Float
        discountPercentage: Float
        rating: Float
        stock: Int
        brand: String
        category: String
        thumbnail: String
        images: [String]
    }

    type ProductsResponse {
        products: [Product]!
        total: Int
        skip: Int
        limit: Int
    }
`)

// Resolvers
const root = {
    message: () => 'Привет, GraphQL!',
    products: async () => {
        try {
            const response = await axios.get('https://dummyjson.com/products')
            return response.data
        } catch (error) {
            throw new Error('Failed to fetch products')
        }
    },
    product: async ({ id }) => {
        try {
            const response = await axios.get(
                `https://dummyjson.com/products/${id}`
            )
            return response.data
        } catch (error) {
            throw new Error(`Product with ID ${id} not found`)
        }
    },
	Subscription: {
		productUpdated: {
			subscribe: (_, { id }) => {
				return pubsub.asyncIterator([`PRODUCT_UPDATED_${id}`]);
			},
		},
	},
}



const server = createServer(app)

const wsServer = new WebSocketServer({
	server,
	path: '/graphql',
	verifyClient: (info, done) => {
		const origin = info.origin
		const allowedOrigins = ['http://localhost:5173']

		if (!origin || allowedOrigins.includes(origin)) {
		console.log(`Разрешено подключение от: ${origin}`)
		return done(true)
		}

		console.log(`Запрещено подключение от: ${origin}`)
		return done(false)
	}
	})

useServer({
	schema,
	roots: root,
	onConnect: (ctx) => {
		console.log('Клиент подключился:', ctx.connectionParams)
		return true // Разрешаем подключение
	},
	onSubscribe: (ctx, msg) => {
		console.log('Клиент подписался:', msg.payload)

	},
	onNext: (ctx, msg, args, result) => {
		console.log('Отправка данных клиенту:', result)
	},
	onError: (ctx, msg, errors) => {
		console.error('Ошибка подписки:', errors)
	},
	onComplete: (ctx, msg) => {
		console.log('Клиент отменил подписку')
	}
}, wsServer)

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
)

app.get('/products', async (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	res.setHeader('Accept', 'application/json')
	try {
		const response = await axios.get('https://dummyjson.com/products')
		res.json(response.data)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.get('/products/:id', async (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	res.setHeader('Accept', 'application/json')
	try {
		const { id } = req.params
		const response = await axios.get(`https://dummyjson.com/products/${id}`)
		res.json(response.data)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Start server
server.listen(5000, () => {
    console.log('Сервер запущен на порту 5000')
    console.log('GraphQL WebSocket endpoint: ws://localhost:5000/graphql')
})

setInterval(() => {
	const mockProduct = {
		id: '1',
		title: 'Test Product',
		price: Math.random() * 100,
		stock: Math.floor(Math.random() * 100),
		// updatedAt: new Date().toISOString()
	}

	console.log(`Публикация обновления для товара ${mockProduct.id}`)
	pubsub.publish(`PRODUCT_UPDATED_${mockProduct.id}`, {
		productUpdated: mockProduct
	})
}, 5000)