<template>
    <div>
        <div class="popup-overflow" @click.stop="closePopup"></div>
        <form class="popup" @submit="onSubmit">
            <div class="success" v-if="success">
                <p>Спасибо за заказ {{ firstName }}!</p>
            </div>
            <div class="" v-else>
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
                    <span class="error">{{ errors.email ? 'Необходимо ввести корректный адрес почты' : '' }}</span>

                    <input
                        class="popup__input"
                        type="text"
                        placeholder="Ваша телефон"
                        v-model="phone"
                        v-bind="phoneAttrs"
                        autocomplete
                    />
                    <span class="error">{{ errors.phone ? 'Необходимо ввести номер телефона' : '' }}</span>

                    <select class="popup__input" v-model="checkedTown">
                        <option disabled value="">Выберите ваш город</option>
                        <option v-for="town in towns" :value="town" :key="town">{{ town }}</option>
                    </select>
                    <span class="error">{{ errors.checkedTown ? 'Необходимо выбрать город' : '' }}</span>

                    <input
                        class="popup__input"
                        type="text"
                        placeholder="Ваш адрес"
                        v-model="address"
                        v-bind="addressAttrs"
                        autocomplete
                    />
                    <span class="error">{{ errors.address ? 'Необходимо ввести ваш адрес' : '' }}</span>

                    <div class="policy">
                        <label>
                            <input class="popup__input" type="checkbox" v-model="policy" />Кнопкой "Оформить заказ"
                            разрешаю обработку персональных данных</label
                        >
                    </div>
                    <span class="error">{{
                        errors.policy ? 'Необходимо согласиться с Политикой Конфиденциальности' : ''
                    }}</span>

                    <br />
                    <textarea class="popup__input" placeholder="Комментарий"></textarea>
                    <button class="popup__btn" :disable="loading" :class="{ 'popup__btn--loading': loading }">
                        Оформить заказ
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

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
const loading = ref(false)
const success = ref(false)

const emit = defineEmits(['close-popup'])

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
        console.log('for server request', values)
        success.value = true

        setTimeout(() => {
            emit('close-popup', true)
        }, 2000)
    } catch (err) {
        alert(err)
        console.log(err, 'Ошибка при отправке данных')
    } finally {
        loading.value = false
    }
})

const closePopup = () => {
    emit('close-popup')
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.popup {
    max-width: 600px;
    width: 100%;
    height: 700px;
    padding: 30px;
    overflow-y: auto;

    background: rgba(black, 0.6);
    border-radius: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10;
    color: #fff;
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
