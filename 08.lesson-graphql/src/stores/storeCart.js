import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
    const items = ref([]);

    const total = computed(() => items.value.reduce((total, item) => total + (item.price * item.amount), 0));

    const totalItems = computed(() => items.value.reduce((count, item) => count + item.amount, 0));

    const add = (product, amount = 1) => {
        const index = items.value.findIndex((item) => item.id === product.id);

        if (index > -1) {
            items.value[index].amount += amount;
        } else {
            items.value.push({
                ...product,
                amount
            });
        }
    }

    const getCartProduct = (id) => {
        return items.value.find((product) => product.id === id);
    }

    const remove = (productId) => {
        items.value = items.value.filter(item => item.id !== productId);
    }

    const updateAmount = (productId, newAmount) => {
        const item = items.value.find(item => item.id === productId);
        if (item) {
            item.amount = newAmount;
        }
    }

    const clear = () => {
        items.value = [];
        console.log(items.value);
    }

    // const getProductAmount = computed((id) => getCartProduct(id)?.amount ?? 0)


    return {
        items,
        total,
        totalItems,
        add,
        remove,
        updateAmount,
        clear,
        getCartProduct,
    }
});