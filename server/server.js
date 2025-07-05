import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import cors from 'cors'
import axios from 'axios'


const app = express()
app.use(
	cors({
		origin: ['http://localhost:5173'],
		credentials: true, // Если нужны куки/авторизация
	})
)

const schema = buildSchema(`
    type Query {
        message: String
        products: ProductsResponse
        product(id: ID!): Product
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
}


app.use(
		'/graphql',
		graphqlHTTP({
			schema: schema,
			rootValue: root,
			graphiql: true,
		})
	)

app.listen(5000, () => {
		console.log('Сервер запущен на порту 5000')
	})

app.get('/products', async (req, res) => {
	try {
		const response = await axios.get('https://dummyjson.com/products')
		res.json(response.data)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})
app.get('/products/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const response = await axios.get(`https://dummyjson.com/products/${id}`);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
