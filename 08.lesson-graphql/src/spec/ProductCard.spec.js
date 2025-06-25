import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'
import { createTestingPinia } from '@pinia/testing'
import { useCartStore } from '@/stores/storeCart.js'

vi.mock('axios')

const pinia = createTestingPinia({
    stubActions: false,
})

const cartStore = useCartStore(pinia)
const testProduct = {
    id: 204,
    title: 'Sleek Wireless Mouse',
    slug: 'sleek-wireless-mouse',
    price: 10,
    description: 'Experience smooth navigation...',
    category: {
        id: 2,
        name: 'Electronics',
        slug: 'electronics',
        image: 'https://i.imgur.com/ZANVnHE.jpeg',
    },
    images: ['https://i.imgur.com/w3Y8NwQ.jpeg'],
}
describe('ProductCard', () => {
    test('component is defined', () => {
        expect(ProductCard).toBeDefined()
    })

    test('add to cart button works', async () => {
        cartStore.add = vi.fn()

        const wrapper = mount(ProductCard, {
            props: {
                product: testProduct,
                quantity: 1,
            },
            global: {
                plugins: [pinia],
                stubs: ['router-link'],
            },
        })

        expect(wrapper.text()).toContain('В корзину')

        const addBtn = wrapper.find('[data-testid="add-to-cart"]')
        await addBtn.trigger('click')

        expect(cartStore.add).toHaveBeenCalledTimes(1)
        expect(cartStore.add.mock.calls[0][0]).toMatchObject(testProduct)
    })
})
