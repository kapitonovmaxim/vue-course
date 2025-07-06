<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated class="bg-primary">
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="leftDrawerOpen = !leftDrawerOpen"
                />

                <q-toolbar-title>Магазин техники</q-toolbar-title>

                <q-space />

                <q-btn flat round dense icon="shopping_cart" to="/catalog">
                    <q-badge color="red" floating>3</q-badge>
                </q-btn>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
            <q-list>
                <q-item-label header>Меню</q-item-label>

                <q-item clickable v-ripple to="/" exact>
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>Главная</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/catalog">
                    <q-item-section avatar>
                        <q-icon name="shopping_cart" />
                    </q-item-section>
                    <q-item-section>Каталог</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <slot />
        </q-page-container>

        <q-footer elevated class="bg-grey-8 text-white">
            <q-toolbar>
                <q-toolbar-title>
                    <div class="text-caption">© 2023 Магазин техники. Все права защищены.</div>
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>
    </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
</script>