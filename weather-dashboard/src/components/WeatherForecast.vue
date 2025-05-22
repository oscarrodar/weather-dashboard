<template>
  <div class="weather-forecast">
    <div v-if="weatherStore.loading">Loading forecast...</div>
    <div v-if="weatherStore.error" class="error">{{ weatherStore.error }}</div>
    <div v-if="weatherStore.forecast && !weatherStore.loading">
      <h3>5-Day Forecast</h3>
      <div class="forecast-list">
        <div v-for="item in processedForecast" :key="item.dt" class="forecast-item">
          <p>{{ formatDate(item.dt_txt) }}</p>
          <img :src="`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`" alt="weather icon">
          <p>{{ item.main.temp }}°C</p>
          <p>{{ item.weather[0].description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';

export default {
  name: 'WeatherForecast',
  setup() {
    const weatherStore = useWeatherStore();

    const processedForecast = computed(() => {
      if (!weatherStore.forecast) return [];
      // Filter to get one forecast per day (e.g., at noon)
      return weatherStore.forecast.list.filter(item => item.dt_txt.includes('12:00:00'));
    });

    const formatDate = (dateTimeString) => {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return {
      weatherStore,
      processedForecast,
      formatDate,
    };
  },
};
</script>

<style scoped>
.weather-forecast {
  /* Padding and border/shadow are handled by the .card class via App.vue */
  width: 100%; /* Ensure it takes the full width of the card container */
}

.weather-forecast h3 {
  text-align: center;
  margin-bottom: 20px; /* Space below the "5-Day Forecast" title */
  font-size: 1.5em;
  color: #333;
}

.forecast-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Distributes items more evenly, good for 2-3 items per row */
  gap: 15px; /* Space between forecast items */
}

.forecast-item {
  background-color: #fff; /* White background for each item */
  border: 1px solid #e0e0e0; /* Slightly darker border for items */
  border-radius: 6px;
  padding: 15px;
  text-align: center;
  flex-basis: calc(50% - 10px); /* For 2 items per row, adjust as needed */
  /* For 5 items, you might want something like calc(20% - 12px) if space allows, or let them wrap naturally */
  min-width: 130px; /* Minimum width before wrapping or shrinking too much */
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: transform 0.2s ease-in-out;
}

.forecast-item:hover {
  transform: translateY(-3px); /* Slight lift on hover */
}

.forecast-item p {
  margin: 5px 0;
  font-size: 0.9em;
  color: #555;
}

.forecast-item p:first-child { /* Date */
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.forecast-item img {
  width: 60px; /* Slightly smaller icon for forecast items */
  height: 60px;
  margin-bottom: 8px;
}

.error {
  color: #D32F2F;
  font-weight: bold;
  padding: 10px;
  border: 1px solid #FFCDD2;
  background-color: #FFEBEE;
  border-radius: 4px;
  text-align: center;
}

/* Responsive adjustments for forecast items */
@media (max-width: 768px) {
  .forecast-item {
    flex-basis: calc(50% - 8px); /* Two items per row on tablets */
  }
}

@media (max-width: 480px) {
  .forecast-list {
    flex-direction: column; /* Stack items vertically on very small screens */
    gap: 10px;
  }
  .forecast-item {
    flex-basis: 100%; /* Full width for stacked items */
  }
}
</style>
