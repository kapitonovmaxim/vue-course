import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { defineComponent } from 'vue';
import CartView from '@/views/CheckoutView.vue';
import axios from 'axios';
import { useCartStore } from '@/stores/storeCart.js';

// Мокируем axios и хранилище
vi.mock('axios');
vi.mock('@/stores/storeCart.js', () => ({
  useCartStore: vi.fn(() => ({
    items: [],
    getCartProduct: vi.fn(),
    total: 0,
    clear: vi.fn(),
    add: vi.fn(),
    remove: vi.fn()
  }))
}));

describe('CartView Component', () => {
    let wrapper
    let router
    let store

    // Создаем тестовый роутер
    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', name: 'home', component: defineComponent({ template: '<div>Home</div>' }) },
                { path: '/checkout', component: CartView },
            ],
        })

        await router.push('/cart')

        // Мокируем хранилище
        store = useCartStore()
    })

    afterEach(() => {
        vi.clearAllMocks()
        wrapper?.unmount()
    })


    it('отображает товары и рассчитывает общую сумму', async () => {
        // Настраиваем моки
        store.items = [
            { id: 1, title: 'Product 1', price: 10, images: ['image1.jpg'] },
            { id: 2, title: 'Product 2', price: 20, images: ['image2.jpg'] },
        ]

        store.getCartProduct.mockImplementation((id) => {
            if (id === 1) return { amount: 2 }
            if (id === 2) return { amount: 3 }
            return null
        })

        store.total = 10 * 2 + 20 * 3 // 80

        axios.get.mockResolvedValue({
            products: store.items,
        })

        wrapper = mount(CartView, {
            global: {
                plugins: [router],
            },
        })

        await new Promise((resolve) => setTimeout(resolve, 0))

        // Проверяем отображение товаров
        console.log('wrapper', wrapper.html());
        const productItems = wrapper.findAll('.product-item')
        expect(productItems.length).toBe(2)

        // Проверяем отображение количества и цены
        expect(wrapper.find('.product-price').text()).toBe('10$')
        expect(wrapper.find('.product-quantity').text()).toBe('× 2')

        // Проверяем расчет общей суммы
        expect(wrapper.find('.total-price').text()).toBe('Общая сумма: 80$')
    })

})