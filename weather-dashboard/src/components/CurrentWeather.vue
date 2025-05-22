<template>
  <div class="current-weather">
    <div v-if="weatherStore.loading">Loading current weather...</div>
    <div v-if="weatherStore.error" class="error">{{ weatherStore.error }}</div>
    <div v-if="weatherStore.currentWeather && !weatherStore.loading">
      <h2>{{ weatherStore.currentWeather.name }}</h2>
      <img :src="`http://openweathermap.org/img/wn/${weatherStore.currentWeather.weather[0].icon}@2x.png`" alt="weather icon">
      <p>Temperature: {{ weatherStore.currentWeather.main.temp }}°C</p>
      <p>Humidity: {{ weatherStore.currentWeather.main.humidity }}%</p>
      <p>Wind Speed: {{ weatherStore.currentWeather.wind.speed }} m/s</p>
      <p>Description: {{ weatherStore.currentWeather.weather[0].description }}</p>
    </div>
  </div>
</template>

<script>
import { useWeatherStore } from '../stores/weatherStore';

export default {
  name: 'CurrentWeather',
  setup() {
    const weatherStore = useWeatherStore();
    return {
      weatherStore,
    };
  },
};
</script>

<style scoped>
.current-weather {
  /* text-align: center; /* The card class or App.vue might handle global text alignment.
                          However, explicitly setting it here ensures this component's content is centered. */
  text-align: center;
  /* Padding, border, border-radius are handled by the .card class via App.vue */
}

.current-weather h2 {
  font-size: 1.8em;
  color: #333; /* Or a specific color for the city name */
  margin-bottom: 10px;
}

.current-weather img {
  width: 100px; /* Or specific size */
  height: 100px;
  margin-bottom: 10px;
}

.current-weather p {
  font-size: 1em;
  line-height: 1.6;
  color: #555; /* Slightly lighter text for details */
  margin-bottom: 5px; /* Space between paragraphs */
}

.current-weather p:last-child {
  margin-bottom: 0;
}

.error {
  color: #D32F2F; /* A more standard error red */
  font-weight: bold;
  padding: 10px;
  border: 1px solid #FFCDD2; /* Light red border */
  background-color: #FFEBEE; /* Light red background */
  border-radius: 4px;
}
</style>
