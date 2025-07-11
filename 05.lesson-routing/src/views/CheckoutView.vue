<template>
    <div class="cart-container">
        <h1>Корзина</h1>

        <template v-if="loading_error">
            <div class="error-message">Произошла ошибка при загрузке товаров</div>
        </template>

        <template v-else-if="!products || !products.length">
            <div class="empty-cart">Нет товаров в корзине</div>
            <router-link :to="{ name: ROUTE_NAMES.HOME }">
                <button class="checkout-button">Перейти на главную</button>
            </router-link>
        </template>

        <template v-else>
            <div class="products-list">
                <div class="product-item" v-for="product in products" :key="product.id">
                    <img class="product-image" :src="product.images[0]" :alt="product.title" />
                    <div class="product-details">
                        <h3 class="product-title">{{ product.title }}</h3>
                        <div class="product-meta">
                            <span class="product-price">{{ product.price }}$</span>
                            <span class="product-quantity">× {{ getProductQuantity(product.id) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="checkout-section">
                <div class="total-price">Общая сумма: {{ totalPrice }}$</div>
                <button class="checkout-button" @click="clearBasket">Очистить корзину</button>
            </div>

            <div class="checkout-section-user">
                <form class="popup" @submit="onSubmit">
                    <div class="popup__title">Сделать заказ</div>
                    <div class="popup__form">
                        <input
                            class="popup__input"
                            type="text"
                            placeholder="Ваше имя"
                            v-model="firstName"
                            v-bind="firstNameAttrs"
                            autocomplete
                        />
                        <span class="error">{{ errors.firstName ? 'Необходимо ваше Имя' : '' }}</span>

                        <input
                            class="popup__input"
                            type="text"
                            placeholder="Ваша почта"
                            v-model="email"
                            v-bind="emailAttrs"
                            autocomplete
                        />
                        <span
                            class="error"
                        >{{ errors.email ? 'Необходимо ввести корректный адрес почты' : '' }}</span>

                        <input
                            class="popup__input"
                            type="text"
                            placeholder="Ваша телефон"
                            v-model="phone"
                            v-bind="phoneAttrs"
                            autocomplete
                        />
                        <span
                            class="error"
                        >{{ errors.phone ? 'Необходимо ввести номер телефона' : '' }}</span>

                        <select class="popup__input" v-model="checkedTown">
                            <option disabled value>Выберите ваш город</option>
                            <option v-for="town in towns" :value="town" :key="town">{{ town }}</option>
                        </select>
                        <span
                            class="error"
                        >{{ errors.checkedTown ? 'Необходимо выбрать город' : '' }}</span>

                        <input
                            class="popup__input"
                            type="text"
                            placeholder="Ваш адрес"
                            v-model="address"
                            v-bind="addressAttrs"
                            autocomplete
                        />
                        <span
                            class="error"
                        >{{ errors.address ? 'Необходимо ввести ваш адрес' : '' }}</span>

                        <div class="policy">
                            <label>
                                <input class="popup__input" type="checkbox" v-model="policy" />Кнопкой "Оформить заказ"
                                разрешаю обработку персональных данных
                            </label>
                        </div>
                        <span class="error">
                            {{
                            errors.policy ? 'Необходимо согласиться с Политикой Конфиденциальности' : ''
                            }}
                        </span>

                        <br />
                        <textarea class="popup__input" placeholder="Комментарий"></textarea>
                        <button
                            class="popup__btn"
                            :disable="loading"
                            :class="{ 'popup__btn--loading': loading }"
                        >Оформить заказ</button>
                    </div>
                </form>
            </div>
        </template>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { ROUTE_NAMES } from '@/constants/routes.js'

const router = useRouter()
const products = ref([])
const loading_error = ref(false)

const emit = defineEmits(['update:basket'])
const loading = ref(false)

const props = defineProps({
    basket: {
        type: Object,
        default: () => ({}),
    },
})

const { values, errors, defineField, handleSubmit } = useForm({
    validationSchema: yup.object({
        email: yup.string().email().required(),
        phone: yup.string().min(9).required(),
        checkedTown: yup.string().min(3).required(),
        firstName: yup.string().min(2).required(),
        policy: yup.boolean().required(),
        address: yup.string().min(3).required(),
    }),
})

const clearBasket = () => {
    products.value = []
    emit('update:basket', {})
}

const getProductQuantity = (productId) => {
    return props.basket[productId] || 0
}

const totalPrice = computed(() => {
    if (!products.value.length) return 0

    return products.value.reduce((sum, product) => {
        return sum + product.price * getProductQuantity(product.id)
    }, 0)
})

const onSubmit = handleSubmit(async () => {
    try {
        loading.value = true
        const response = await axios.post('https://httpbin.org/post', values, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        console.log('Ответ сервера:', response.data)
        console.log('for server request', values)
        alert('Заказ успешно оформлен!')
        products.value = []
        emit('update:basket', {})
        router.push('/')
    } catch (err) {
        alert(err)
        console.log(err, 'Ошибка при отправке данных')
        loading_error.value = true
    } finally {
        loading.value = false
    }
})

onMounted(async () => {
    try {
        const response = await axios.get('https://api.escuelajs.co/api/v1/products')

        products.value = response.data.filter((product) => {
            return product.id in props.basket
        })
    } catch (err) {
        console.error('Ошибка загрузки товаров:', err)
        loading_error.value = true
    }
})

const towns = [
    'Москва',
    'Санкт-Петербург',
    'Владивосток',
    'Новосибирск',
    'Воронеж',
    'Краснодар',
    'Ростов-на-Дону',
    'Казань',
    'Екатеринбург',
    'Нижний Новгород',
]

const [firstName, firstNameAttrs] = defineField('firstName', {
    validateOnModelUpdate: false,
})

const [phone, phoneAttrs] = defineField('phone', {
    validateOnModelUpdate: false,
})

const [checkedTown] = defineField('checkedTown', {
    validateOnModelUpdate: false,
})

const [address, addressAttrs] = defineField('address', {
    validateOnModelUpdate: false,
})

const [policy] = defineField('policy', {
    validateOnModelUpdate: false,
})

const [email, emailAttrs] = defineField('email', {
    validateOnModelUpdate: false,
})
</script>

<style lang="scss" scoped>
.cart-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.error-message,
.empty-cart {
    color: #666;
    text-align: center;
    padding: 40px 0;
    font-size: 1.2rem;
}

.products-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
}

.product-item {
    display: flex;
    gap: 20px;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 8px;
}

.product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
}

.product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-title {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
}

.product-meta {
    display: flex;
    gap: 15px;
    margin-top: 10px;
}

.product-price {
    font-weight: bold;
    color: #2c3e50;
}

.product-quantity {
    color: #666;
}

.checkout-section {
    border-top: 1px solid #eee;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-price {
    font-size: 1.2rem;
    font-weight: bold;
}

.checkout-button {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: #3aa876;
    }
}

@media (max-width: 600px) {
    .product-item {
        flex-direction: column;
    }

    .product-image {
        width: 100%;
        height: auto;
        max-height: 200px;
    }
}

// Форма оформления заказа
* {
    box-sizing: border-box;
}

.checkout-section-user {
    margin-top: 40px;
}
.popup {
    width: 100%;
    padding: 30px;

    border-radius: 20px;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10;
    color: #333;
    font-size: 3rem;
    .policy {
        margin: 20px 0;
        label {
            display: flex;
            align-items: center;
            font-size: 16px;
        }
        .popup__input {
            width: 32px;
            height: 32px;
            margin-right: 20px;
        }
    }

    &-overflow {
        background: #00000040;
        backdrop-filter: blur(20px);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 9;
    }

    &__title {
        text-align: center;
        text-transform: uppercase;
        font-weight: bold;
    }
    &__input {
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #000;
        outline: none;
        font-size: 1.5rem;
        &:focus {
            border-color: #fff;
        }
        &:not(:last-child) {
            margin-bottom: 10px;
        }
    }
    &__btn {
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #000;
        outline: none;
        font-size: 1.5rem;
        background: #000;
        color: #fff;
        cursor: pointer;
        &--loading {
            opacity: 0.5;
            cursor: wait;
        }
    }
}
.error {
    font-size: 14px;
    color: red;
    display: block;
    margin-bottom: 5px;
}
</style>