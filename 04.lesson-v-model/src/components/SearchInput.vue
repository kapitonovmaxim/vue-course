<template>
    <div class="search">
        <input
            class="search-input"
            v-model="searchValue"
            type="text"
            placeholder="Поиск товара"
            @keyup.enter="handleSearch"
        />
    </div>
</template>

<script setup>
const searchValue = defineModel()
const emit = defineEmits(['search'])
</script>

<style scoped>
.search {
    position: relative;
    display: flex;
    gap: 10px;
    align-items: center;
}

.search-input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-width: 250px;
}

.search-filters {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.filter-toggle {
    padding: 6px 10px;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}

label {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
}
</style>
