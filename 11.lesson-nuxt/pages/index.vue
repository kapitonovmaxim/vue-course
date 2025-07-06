<template>
    <q-page padding>
        <q-card class="my-card">
            <q-card-section>
                <div class="text-h4">Главная страница</div>
                <q-breadcrumbs class="q-mt-sm">
                    <q-breadcrumbs-el label="Главная" icon="home" />
                </q-breadcrumbs>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <p>Добро пожаловать в наш магазин!</p>
                <q-btn
                    color="primary"
                    label="Перейти в каталог"
                    to="/catalog"
                    icon="shopping_cart"
                />
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
useHead({
    title: 'Главная страница',
})
</script>

<style lang="scss">
.my-card {
    max-width: 800px;
    margin: 0 auto;
}
</style>