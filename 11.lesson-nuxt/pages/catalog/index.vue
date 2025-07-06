<template>
    <q-page padding>
        <q-card class="my-card">
            <q-card-section>
                <div class="text-h4">Каталог товаров</div>
                <q-breadcrumbs class="q-mt-sm">
                    <q-breadcrumbs-el label="Главная" icon="home" to="/" />
                    <q-breadcrumbs-el label="Каталог" icon="shopping_cart" />
                </q-breadcrumbs>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="row q-col-gutter-md">
                    <div
                        v-for="product in products"
                        :key="product.id"
                        class="col-12 col-sm-6 col-md-4"
                    >
                        <q-card flat bordered>
                            <q-img
                                :src="`https://placebear.com/g/400/40${product.id}`"
                                :alt="product.name"
                                basic
                            />
                            <q-card-section>
                                <div class="text-h6">{{ product.name }}</div>
                                <div class="text-subtitle2 text-primary">{{ product.price }} ₽</div>
                            </q-card-section>

                            <q-card-actions>
                                <q-btn
                                    flat
                                    color="primary"
                                    label="Подробнее"
                                    :to="`/catalog/${product.id}`"
                                />
                                <q-space />
                                <q-btn color="primary" icon="shopping_cart" round dense flat />
                            </q-card-actions>
                        </q-card>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
const products = [
    { id: 1, name: 'Ноутбук', price: 50000 },
    { id: 2, name: 'Смартфон', price: 30000 },
    { id: 3, name: 'Наушники', price: 5000 },
]

useHead({
    title: 'Каталог товаров',
})
</script>

<style lang="scss" scoped>
.my-card {
    max-width: 1200px;
    margin: 0 auto;
}
</style>