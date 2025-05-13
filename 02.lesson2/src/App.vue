<template>
  <div class="center">
    <h1>Привет, тут будет список учителей школы LOTUS</h1>
    <ul v-show="showList">
      <li v-for="n in userNames" :key="n">{{ n.name }} <span v-show="showTeacherAge">{{n.age}}&nbsp;лет</span></li>
    </ul>
    <div class="footer">
      <button @click="showAge">Показать возраст учителей</button>
      <button @click="toggleList">{{ showList ? 'Скрыть' : 'Показать' }} список учителей</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let showTeacherAge = ref(false);
let showList = ref(true);

const nameHoverText = 'white';
const nameHoverBg = 'black';

const userNames = {
  1: { name: 'Марина Николаевна', age: 34 },
  2: { name: 'Кристина Михайловна', age: 25 },
  3: { name: 'Мария Александровна', age: 23 },
  4: { name: 'Ольга Васильевна', age: 31 },
  5: { name: 'Наталья Андреевна', age: 30 },
  6: { name: 'Анастасия Петровна', age: 29 },
  7: { name: 'Анна Валерьевна', age: 28 },
  8: { name: 'Дарья Максимовна', age: 27 },
  9: { name: 'Алена Сергеевна', age: 26 },
  10: { name: 'Мария Евгеньевна', age: 25 },
  11: { name: 'Елена Александровна', age: 24 }
};


function showAge() {
  showTeacherAge.value = !showTeacherAge.value;
}

function toggleList() {
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

li:hover {
  color: v-bind(nameHoverText);
  background-color: v-bind(nameHoverBg);
  transition: 0.25s;
}
</style>