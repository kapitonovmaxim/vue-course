import { describe, expect, test, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import CatalogView from '@/views/CatalogView.vue'
import ProductCard from '@/components/ProductCard.vue'
import SearchInput from '@/components/SearchInput.vue'
import { createTestingPinia } from '@pinia/testing'

import axios from 'axios'

vi.mock('axios')
vi.mock('@/composables/useAuth.js', () => ({
    default: {
        isAuthenticated: vi.fn(() => false),
    },
}))
const pinia = createTestingPinia({
    stubActions: false,
})

describe('CatalogView', () => {
    let router
    const mockProducts = [
        {
            id: 3359,
            title: 'Classic Heather Gray Hoodie',
            slug: 'classic-heather-gray-hoodie',
            price: 69,
            description:
                'Stay cozy and stylish with our Classic Heather Gray Hoodie. Crafted from soft, durable fabric, it features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Perfect for a casual day out or a relaxing evening in, this hoodie is a versatile addition to any wardrobe.',
            category: {
                id: 1,
                name: 'Clothes',
                slug: 'clothes',
                image: 'https://i.imgur.com/QkIa5tT.jpeg',
                creationAt: '2025-06-18T21:42:57.000Z',
                updatedAt: '2025-06-18T21:42:57.000Z',
            },
            images: [
                'https://i.imgur.com/cHddUCu.jpeg',
                'https://i.imgur.com/CFOjAgK.jpeg',
                'https://i.imgur.com/wbIMMme.jpeg',
            ],
            creationAt: '2025-06-19T14:07:42.000Z',
            updatedAt: '2025-06-19T14:07:42.000Z',
        },
        {
            id: 3360,
            title: 'Classic Grey Hooded Sweatshirt',
            slug: 'classic-grey-hooded-sweatshirt',
            price: 90,
            description:
                'Elevate your casual wear with our Classic Grey Hooded Sweatshirt. Made from a soft cotton blend, this hoodie features a front kangaroo pocket, an adjustable drawstring hood, and ribbed cuffs for a snug fit. Perfect for those chilly evenings or lazy weekends, it pairs effortlessly with your favorite jeans or joggers.',
            category: {
                id: 1,
                name: 'Clothes',
                slug: 'clothes',
                image: 'https://i.imgur.com/QkIa5tT.jpeg',
                creationAt: '2025-06-18T21:42:57.000Z',
                updatedAt: '2025-06-18T21:42:57.000Z',
            },
            images: [
                'https://i.imgur.com/R2PN9Wq.jpeg',
                'https://i.imgur.com/IvxMPFr.jpeg',
                'https://i.imgur.com/7eW9nXP.jpeg',
            ],
            creationAt: '2025-06-19T14:07:42.000Z',
            updatedAt: '2025-06-19T14:07:42.000Z',
        },
    ]

    beforeEach(() => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
        })
        vi.clearAllMocks()
    })

    test('successfully loads and displays products', async () => {
        axios.get.mockResolvedValueOnce({ data: mockProducts })

        const wrapper = mount(CatalogView, {
            global: {
                plugins: [router, pinia],
                components: {
                    ProductCard,
                    SearchInput,
                },
                stubs: ['router-link'],
            },
        })

        expect(wrapper.find('.error-message').exists()).toBe(false)
        expect(wrapper.find('.products').exists()).toBe(true)

        await flushPromises()

        expect(axios.get).toHaveBeenCalledTimes(1)
        expect(axios.get).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products')

        expect(wrapper.find('h1').text()).toBe('Каталог товаров')
        const productCards = wrapper.findAllComponents(ProductCard)
        expect(productCards.length).toBe(2)

        expect(productCards[0].props('product')).toEqual(mockProducts[0])
        expect(productCards[1].props('product')).toEqual(mockProducts[1])
    })


    test('successfully loads and displays products', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProducts })

      const wrapper = mount(CatalogView, {
          global: {
              plugins: [router, pinia],
              components: {
                  ProductCard,
                  SearchInput,
              },
              stubs: ['router-link'],
          },
      })

      expect(wrapper.find('.error-message').exists()).toBe(false)
      expect(wrapper.find('.products').exists()).toBe(true)

      await flushPromises()

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products')

      expect(wrapper.find('h1').text()).toBe('Каталог товаров')
      const productCards = wrapper.findAllComponents(ProductCard)
      expect(productCards.length).toBe(2)

      expect(productCards[0].props('product')).toEqual(mockProducts[0])
      expect(productCards[1].props('product')).toEqual(mockProducts[1])
  })
})
