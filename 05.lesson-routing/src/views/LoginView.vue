<template>
    <div class="auth-container">
        <h1 class="auth-title">Авторизация</h1>
        <form @submit.prevent="onSubmit" class="auth-form">
            <div class="form-group">
                <label for="login" class="form-label">Логин</label>
                <input
                    id="login"
                    class="form-input"
                    type="text"
                    placeholder="Введите ваш логин"
                    v-model="login"
                    v-bind="loginAttrs"
                    autocomplete="username"
                    :class="{ 'is-invalid': errors.login }"
                />
                <span class="error-message" v-if="errors.login">{{ errors.login }}</span>
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Пароль</label>
                <input
                    id="password"
                    class="form-input"
                    type="password"
                    placeholder="Введите ваш пароль"
                    v-model="password"
                    v-bind="passwordAttrs"
                    autocomplete="current-password"
                    :class="{ 'is-invalid': errors.password }"
                />
                <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="!isSubmitting">Войти</span>
                <span v-else>Вход...</span>
            </button>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const emit = defineEmits(['update:auth'])

const isAuth = ref(false)
const props = defineProps({
    basket: {},
    auth: {
        type: Boolean,
        required: false,
    },
})

onMounted(() => {
    isAuth.value = props.auth || getAuth()

    if (isAuth.value) {
        router.push('/')
    }
})

const router = useRouter()
const isSubmitting = ref(false)

const getAuth = () => {
    return window.localStorage.getItem('auth') || false
}

const setAuth = () => {
    window.localStorage.setItem('auth', true)
    emit('update:auth', true)
}

const { values, errors, defineField, handleSubmit, setFieldError } = useForm({
    validationSchema: yup.object({
        login: yup
            .string()
            .min(1, 'Логин должен содержать минимум 3 символа')
            .required('Поле логина обязательно для заполнения'),
        password: yup
            .string()
            .min(1, 'Пароль должен содержать минимум 6 символов')
            .required('Поле пароля обязательно для заполнения'),
    }),
})

const [login, loginAttrs] = defineField('login')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
    isSubmitting.value = true

    try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        alert('Вы успешно авторизованы!')
        setAuth()
        router.push('/new-product')
    } catch (error) {
        console.error('Ошибка авторизации:', error)
        setFieldError('password', 'Ошибка сервера. Попробуйте позже')
    } finally {
        isSubmitting.value = false
    }
})
</script>

<style lang="scss" scoped>
.auth-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-title {
    text-align: center;
    margin-bottom: 2rem;
    color: #2c3e50;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-size: 0.9rem;
    color: #555;
}

.form-input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
        outline: none;
        border-color: #42b983;
        box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
    }

    &.is-invalid {
        border-color: #ff4444;
    }
}

.error-message {
    color: #ff4444;
    font-size: 0.8rem;
    margin-top: 0.25rem;
}

.submit-btn {
    padding: 0.75rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover:not(:disabled) {
        background-color: #3aa876;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
}

@media (max-width: 480px) {
    .auth-container {
        padding: 1.5rem;
        margin: 0 1rem;
    }
}

.empty-text {
    text-align: center;
}
</style>