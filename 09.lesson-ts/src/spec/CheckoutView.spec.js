import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { defineComponent } from 'vue'
import CheckoutView from '@/views/CheckoutView.vue'
import axios from 'axios'
import { useCartStore } from '@/stores/storeCart.js'

// Мокируем axios и хранилище
vi.mock('axios')
vi.mock('@/stores/storeCart.js', () => ({
    useCartStore: vi.fn(() => ({
        items: [],
        getCartProduct: vi.fn(),
        total: 0,
        clear: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
    })),
}))

describe('CheckoutView Component', () => {
    let wrapper
    let router
    let store

    // Создаем тестовый роутер
    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', name: 'home', component: defineComponent({ template: '<div>Home</div>' }) },
                { path: '/checkout', component: CheckoutView },
            ],
        })

        await router.push('/checkout')

        // Мокируем хранилище
        store = useCartStore()
    })

    afterEach(() => {
        vi.clearAllMocks()
        wrapper?.unmount()
    })

    test('отображает сообщение о пустой корзине, когда нет товаров', async () => {
        store.items = []

        wrapper = mount(CheckoutView, {
            global: {
                plugins: [router],
            },
        })

        await flushPromises()

        expect(wrapper.find('.empty-cart').exists()).toBe(true)
        expect(wrapper.find('.empty-cart').text()).toBe('Нет товаров в корзине')
        expect(wrapper.find('.checkout-button').text()).toBe('Перейти на главную')
    })

    test('корректно отображает товары в корзине', async () => {
        // Настраиваем моки
        store.items = [
            {
                id: 1,
                title: 'Test Product 1',
                price: 10,
                images: ['image1.jpg'],
                thumbnail: 'thumbnail1.jpg'
            },
            {
                id: 2,
                title: 'Test Product 2',
                price: 20,
                images: ['image2.jpg'],
                thumbnail: 'thumbnail2.jpg'
            }
        ]

        store.getCartProduct.mockImplementation((id) => {
            if (id === 1) return { amount: 2 }
            if (id === 2) return { amount: 1 }
            return null
        })

        store.total = 40 // 10*2 + 20*1

        wrapper = mount(CheckoutView, {
            global: {
                plugins: [router],
            },
        })

        await flushPromises()

        // Проверяем отображение товаров
        const productItems = wrapper.findAll('.product-item')
        expect(productItems.length).toBe(2)

        // Проверяем отображение названий товаров
        const titles = wrapper.findAll('.product-title')
        expect(titles[0].text()).toBe('Test Product 1')
        expect(titles[1].text()).toBe('Test Product 2')

        // Проверяем отображение цен
        const prices = wrapper.findAll('.product-price')
        expect(prices[0].text()).toBe('10$')
        expect(prices[1].text()).toBe('20$')

        // Проверяем отображение количества
        const quantities = wrapper.findAll('.product-quantity')
        expect(quantities[0].text()).toBe('× 2')
        expect(quantities[1].text()).toBe('× 1')

        // Проверяем расчет общей суммы
        expect(wrapper.find('.total-price').text()).toBe('Общая сумма: 40$')
    })
})