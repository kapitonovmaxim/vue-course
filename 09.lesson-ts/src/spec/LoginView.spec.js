import { describe, expect, test, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import auth from '@/composables/useAuth.js'
import { ref } from 'vue'

vi.mock('@/composables/useAuth.js', () => ({
    default: {
        isAuthenticated: vi.fn(),
        set: vi.fn(),
        get: vi.fn(),
    },
}))

describe('LoginView', () => {
    let router

    beforeEach(() => {
        vi.clearAllMocks()

        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
                { path: '/new-product', name: 'new-product', component: { template: '<div>New Product</div>' } },
            ],
        })

        auth.isAuthenticated.mockReturnValue(false)
        auth.get.mockReturnValue(false)
    })

    test('component is defined', () => {
        expect(LoginView).toBeDefined()
    })

    test('component renders correctly', async () => {
        await router.push('/login')
        const wrapper = mount(LoginView, {
            global: {
                plugins: [router],
                stubs: ['router-link'],
                provide: {
                    isAuth: false,
                    authUser: () => {
                        updateAuth(true)
                        auth.set(true)
                    },
                },
            },
        })
        expect(wrapper.html()).toContain('Авторизация')
    })

    test('successful login redirects to /new-product', async () => {
        auth.set.mockImplementation(() => {
            auth.get.mockReturnValue(true)
            return Promise.resolve(true)
        })

        await router.push('/login')

        const isAuth = ref(auth.isAuthenticated())
        const updateAuth = (value) => {
            isAuth.value = value
        }
        const wrapper = mount(LoginView, {
            global: {
                plugins: [router],
                stubs: ['router-link'],
                provide: {
                    isAuth: false,
                    authUser: () => {
                        updateAuth(true)
                        auth.set(true)
                    },
                },
            },
        })

        await wrapper.find('[data-testid="login"]').setValue('test')
        await wrapper.find('[data-testid="password"]').setValue('password123')
        await wrapper.find('[data-testid="submit"]').trigger('submit')


        await new Promise((resolve) => setTimeout(resolve, 1200))
        await router.isReady()


        expect(auth.set).toHaveBeenCalledTimes(1)
        expect(auth.get()).toBe(true)
        expect(router.currentRoute.value.path).toBe('/new-product')
    })
})
