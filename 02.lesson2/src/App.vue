<template>
  <div class="center">
    <h1>Привет, тут будет список учителей школы LOTUS</h1>
    <ul v-show="showList">
      <li
        @click="toggleActiveName"
        v-for="(teacher, index) in teachers"
        :key="index"
        :class="{ active: activeNames.includes(index) }"
      >
        {{ teacher.name }}
        <span v-show="showTeacherAge">{{ teacher.age }}&nbsp;лет</span>
      </li>
    </ul>
    <div class="footer">
      <button @click="toggleAgeVisibility">{{ showTeacherAge ? 'Скрыть' : 'Показать' }} возраст учителей</button>
      <button @click="toggleListVisibility">{{ showList ? 'Скрыть' : 'Показать' }} список учителей</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showTeacherAge = ref(false);
const showList = ref(true);
const activeNames = ref([]);

const hoverColors = {
  text: 'white',
  bg: '#0074D9',
  bgActive: '#009363',
}

const teachers = [
  { name: 'Марина Николаевна', age: 34 },
  { name: 'Кристина Михайловна', age: 25 },
  { name: 'Мария Александровна', age: 23 },
  { name: 'Ольга Васильевна', age: 31 },
  { name: 'Наталья Андреевна', age: 30 },
  { name: 'Анастасия Петровна', age: 29 },
  { name: 'Анна Валерьевна', age: 28 },
  { name: 'Дарья Максимовна', age: 27 },
  { name: 'Алена Сергеевна', age: 26 },
  { name: 'Мария Евгеньевна', age: 25 },
  { name: 'Елена Александровна', age: 24 }
];

function toggleActiveName(event) {
  const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);
  if (activeNames.value.includes(index)) {
    activeNames.value = activeNames.value.filter(i => i !== index);
  } else {
    activeNames.value.push(index);
  }
}

function toggleAgeVisibility() {
  showTeacherAge.value = !showTeacherAge.value;
}

function toggleListVisibility() {
  showList.value = !showList.value;
}

</script>

<style scoped>
.center {
  text-align: center;
}
.center h1 {
  font-size: 2rem;
  margin-bottom: 50px;
}
.center ul {
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
  font-size: 1.5rem;
  list-style-type: none;
  padding-left: 0;
  line-height: 2.2rem;
  padding: 20px;
  border: 2px solid grey;
  border-radius: 6px;
}

.footer {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 50px;
}

button {
  border: 1px solid grey;
  background-color: #fff;
  padding: 8px 15px;
  font-size: 1rem;
  border-radius: 6px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  user-select: none;
}

li {
  cursor: pointer;
  user-select: none;
  transition: 0.25s;
  padding: 5px 10px;
  border-radius: 4px;
}

li:hover {
  color: v-bind('hoverColors.text');
  background-color: v-bind('hoverColors.bg');
}

li.active {
  color: v-bind('hoverColors.text');
  background-color: v-bind('hoverColors.bgActive');
}
</style>