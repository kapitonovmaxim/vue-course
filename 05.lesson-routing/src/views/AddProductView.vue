<template>
    <div>
        <!-- <div class="popup-overflow"></div> -->
        <div class="popup success" v-if="success">
            <p>Товар {{ title }} успешно добавлен в каталог</p>
            <p>
                <button clas="popup__btn" @click="resetState()">Добавить ещё один товар?</button>
            </p>
            <router-link :to="{ name: ROUTE_NAMES.HOME }">
                <button>Перейти на главную</button>
            </router-link>
        </div>
        <form class="popup" @submit="onSubmit" v-else>
            <h1 class="popup__title">Добавить новый товар</h1>
            <div class="popup__form">
                <input
                    class="popup__input"
                    type="text"
                    placeholder="Название продукта"
                    v-model="title"
                />
                <span class="error">{{ errors.title ? 'Необходимо Название продукта' : '' }}</span>
                <input class="popup__input" type="text" placeholder="Цена продукта" v-model="price" />
                <span class="error">{{ errors.price ? 'Необходимо цена продукта' : '' }}</span>

                <textarea class="popup__input" placeholder="Описание" v-model="description"></textarea>
                <span class="error">{{ errors.description ? 'Необходимо небольшое описание' : '' }}</span>
                <button
                    class="popup__btn"
                    :disable="loading"
                    :class="{ 'popup__btn--loading': loading }"
                >Добавить</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { ROUTE_NAMES } from '@/constants/routes.js'


const loading = ref(false)
const success = ref(false)

const { values, errors, defineField, handleSubmit } = useForm({
    validationSchema: yup.object({
        price: yup.number().min(1).required(),
        title: yup.string().min(2).required(),
        description: yup.string().min(5).required(),
    }),
})

const [title] = defineField('title', {
    validateOnModelUpdate: false,
})
const [price] = defineField('price', {
    validateOnModelUpdate: false,
})
const [description] = defineField('description', {
    validateOnModelUpdate: false,
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
        success.value = true
    } catch (err) {
        alert(err)
        console.log(err, 'Ошибка при отправке данных')
    } finally {
        loading.value = false
    }
})
const resetState = () => {
    title.value = ''
    price.value = ''
    description.value = ''
    errors.value = {}
    success.value = false
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.popup {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
    // height: 700px;
    padding: 30px;
    overflow-y: auto;

    background: rgba(black, 0.6);
    border-radius: 20px;
    // position: fixed;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10;
    color: #fff;
    font-size: 3rem;
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
        font-size: 32px;
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
