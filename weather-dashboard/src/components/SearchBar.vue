<template>
  <div class="search-bar">
    <input type="text" v-model="city" placeholder="Enter city name" @keyup.enter="search" />
    <button @click="search">Search</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';

export default {
  name: 'SearchBar',
  setup() {
    const city = ref('');
    const weatherStore = useWeatherStore();

    const search = () => {
      if (city.value.trim()) {
        weatherStore.fetchWeatherData(city.value.trim());
      }
    };

    return {
      city,
      search,
    };
  },
};
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: center; /* Centers input and button */
  align-items: center;
  gap: 10px; /* Adds space between input and button */
  width: 100%; /* Take full width of its container in App.vue (which is a card) */
}

input[type="text"] {
  flex-grow: 1; /* Allows input to take available space */
  max-width: 400px; /* Optional: prevent it from becoming too wide */
  /* padding, border, border-radius, font-size are inherited from main.css or are fine */
}

button {
  background-color: #4CAF50; /* Specific button color */
  color: white;
  /* padding, border, border-radius, font-size inherited or fine */
}

button:hover {
  background-color: #45a049; /* Darker shade on hover */
}
</style>
