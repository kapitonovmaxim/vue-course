<template>
    <q-page padding>
        <q-card class="my-card">
            <q-card-section>
                <div class="text-h4">Детали товара</div>
                <q-breadcrumbs class="q-mt-sm">
                    <q-breadcrumbs-el label="Главная" icon="home" to="/" />
                    <q-breadcrumbs-el label="Каталог" to="/catalog" />
                    <q-breadcrumbs-el :label="product?.name || 'Товар'" />
                </q-breadcrumbs>
            </q-card-section>

            <q-separator />

            <q-card-section v-if="product">
                <div class="row q-col-gutter-lg">
                    <div class="col-12 col-md-6">
                        <q-img
                            :src="`https://placebear.com/g/400/40${product.id}`"
                            :alt="product.name"
                            ratio="1"
                            class="rounded-borders"
                        />
                    </div>

                    <div class="col-12 col-md-6">
                        <div class="text-h3">{{ product.name }}</div>
                        <div class="text-h5 text-primary q-mt-md">{{ product.price }} ₽</div>

                        <q-separator class="q-my-md" />

                        <div class="text-body1">
                            <p>ID товара: {{ product.id }}</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>

                        <div class="q-mt-xl q-gutter-y-md q-gutter-x-md">
                            <q-btn
                                class
                                color="primary"
                                label="Добавить в корзину"
                                icon="shopping_cart"
                                size="lg"
                            />
                            <q-btn
                                outline
                                color="primary"
                                label="Назад в каталог"
                                to="/catalog"
                                size="lg"
                            />
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section v-else>
                <q-banner inline-actions class="text-white bg-red">
                    <template v-slot:avatar>
                        <q-icon name="error" color="white" />
                    </template>
                    Товар не найден
                    <template v-slot:action>
                        <q-btn flat color="white" label="В каталог" to="/catalog" />
                    </template>
                </q-banner>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
const route = useRoute()
const productId = route.params.id

const products = [
    { id: 1, name: 'Ноутбук', price: 50000 },
    { id: 2, name: 'Смартфон', price: 30000 },
    { id: 3, name: 'Наушники', price: 5000 },
]

const product = products.find((p) => p.id === Number(productId))

useHead({
    title: product ? `Товар: ${product.name}` : 'Товар не найден',
})
</script>

<style lang="scss" scoped>
.my-card {
    max-width: 1400px;
    margin: 0 auto;
}
</style>