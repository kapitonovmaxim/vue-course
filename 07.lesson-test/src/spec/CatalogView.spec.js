import { describe, expect, test, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import axios from 'axios'
import CatalogView from '@/views/CatalogView.vue'
import ProductCard from '@/components/ProductCard.vue'
import SearchInput from '@/components/SearchInput.vue'

// Мокируем зависимости
vi.mock('axios')
vi.mock('@/composables/useAuth.js', () => ({
  default: {
    isAuthenticated: vi.fn(() => false)
  }
}))

describe('CatalogView', () => {
  let router
//   const mockProducts = [
//     { id: 1, title: 'iPhone 9', price: 549, thumbnail: '...' },
//     { id: 2, title: 'Samsung Galaxy', price: 899, thumbnail: '...' }
//   ]

  beforeEach(() => {
    // Создаем тестовый роутер
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/catalog', name: 'catalog' },
        { path: '/new-product', name: 'new-product' }
      ]
    })

    // Сбрасываем моки перед каждым тестом
    vi.clearAllMocks()
  })

//   test('renders loading state initially', () => {
//     const wrapper = mount(CatalogView, {
//       global: {
//         plugins: [router],
//         stubs: {
//           'router-link': true,
//           'product-card': true,
//           'search-input': true
//         }
//       }
//     })

//     expect(wrapper.find('.catalog-top').exists()).toBe(true)
//     expect(wrapper.find('.error-message').exists()).toBe(false)
//   })

test('successfully loads and displays products', async () => {
  // 1. Подготавливаем мок данных
  const mockProducts = [
    { id: 1, title: 'iPhone 9', price: 549, thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg' },
    { id: 2, title: 'Samsung Galaxy', price: 899, thumbnail: 'https://i.dummyjson.com/data/products/2/thumbnail.jpg' }
  ]

  // 2. Мокируем axios.get для возврата тестовых данных
  axios.get.mockResolvedValueOnce({
    data: {
      products: mockProducts,
      total: 2,
      skip: 0,
      limit: 2
    }
  })

  // 3. Монтируем компонент
  const wrapper = mount(CatalogView, {
    global: {
      plugins: [router],
      components: {
        ProductCard,
        SearchInput
      }
    }
  })

  // 4. Ждем завершения асинхронных операций
  await flushPromises() // или await new Promise(resolve => setTimeout(resolve, 0))

  // 5. Проверяем результаты
  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get).toHaveBeenCalledWith('https://dummyjson.com/products')

  // Проверяем что данные установились в компонент
  expect(wrapper.vm.products).toEqual(mockProducts)

  // Проверяем что товары отрендерились
  const productCards = wrapper.findAllComponents(ProductCard)
  expect(productCards).toHaveLength(2)

  // Проверяем что первый товар отображается правильно
  expect(productCards[0].props('product')).toEqual(mockProducts[0])

  // Проверяем что нет сообщения об ошибке
  expect(wrapper.find('.error-message').exists()).toBe(false)
})

//   test('shows error message when loading fails', async () => {
//     // Мокируем ошибку API
//     axios.get.mockRejectedValueOnce(new Error('Network Error'))

//     const wrapper = mount(CatalogView, {
//       global: {
//         plugins: [router],
//         stubs: {
//           'product-card': true,
//           'search-input': true
//         }
//       }
//     })

//     await new Promise(resolve => setTimeout(resolve, 0))

//     expect(wrapper.find('.error-message').exists()).toBe(true)
//     expect(wrapper.find('.error-message').text())
//       .toContain('Произошла ошибка при загрузке данных')
//     expect(wrapper.vm.loading_error).toBe(true)
//   })

})