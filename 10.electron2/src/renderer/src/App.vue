<template>
  <div class="weather-app">
    <h1>Погодное приложение</h1>

    <div class="search-box">
      <input v-model="city" placeholder="Введите город..." @keyup.enter="fetchWeather" />
      <button @click="fetchWeather">Поиск</button>
    </div>
    <div class="towns-wrapper">
      <button v-for="town in towns" :key="town" @click="setCity(town)">{{ town }}</button>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-if="currentWeather" class="weather-info">
      <h2>{{ city }}</h2>
      <div class="weather-main">
        <img :src="`https:${currentWeather.condition.icon}`" :alt="currentWeather.condition.text" />
        <p class="temp">{{ Math.round(currentWeather.temp_c) }}°C</p>
      </div>
      <p class="description">{{ currentWeather.condition.text }}</p>
      <div class="details">
        <p>Влажность: {{ currentWeather.humidity }}%</p>
        <p>Ветер: {{ currentWeather.wind_kph }} км/ч</p>
      </div>
    </div>

    <div v-if="forecast.length > 0" class="forecast">
      <h3>Прогноз на 3 дня</h3>
      <div class="forecast-list">
        <div v-for="day in forecast" :key="day.date" class="forecast-day">
          <p>{{ formatDate(day.date_epoch) }}</p>
          <img :src="`https:${day.day.condition.icon}`" />
          <p>{{ Math.round(day.day.avgtemp_c) }}°C</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const towns = ['Санкт-Петербург', 'Москва', 'Сочи']

const city = ref('')
const currentWeather = ref(null)
const forecast = ref([])
const loading = ref(false)
const error = ref('')

const setCity = (val) => {
  if (!val.trim()) return
  city.value = val.trim()
  fetchWeather()
}
const fetchWeather = async () => {
  if (!city.value.trim()) return

  loading.value = true
  currentWeather.value = null
  forecast.value = []
  error.value = ''

  try {
    const weatherData = await window.electronAPI.fetchWeather(city.value)

    currentWeather.value = weatherData.current
    forecast.value = weatherData.forecast.forecastday
    localStorage.setItem('lastCity', city.value)
    console.log('weatherData', weatherData)
  } catch (error) {
    error.value = 'Город не найден. Попробуйте ещё раз.'
    currentWeather.value = null
    forecast.value = []
  } finally {
    loading.value = false
  }
}

// Форматирование даты
const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('ru-RU', { weekday: 'short' })
}

// Загрузка последнего города
onMounted(() => {
  const lastCity = localStorage.getItem('lastCity')
  if (lastCity) {
    city.value = lastCity
    fetchWeather()
  }
})
</script>

<style>
.weather-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.search-box {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

input {
  padding: 10px;
  flex-grow: 1;
}

button {
  padding: 10px 15px;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

.location-btn {
  background: #646cff;
}

.weather-info {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
}

.weather-main {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.temp {
  font-size: 2rem;
  font-weight: bold;
}

.details {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.forecast {
  margin-top: 30px;
}

.forecast-list {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.forecast-day {
  padding: 10px;
  border-radius: 8px;
  width: 18%;
}

.error {
  color: red;
  margin-top: 20px;
}
.towns-wrapper {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
</style>
