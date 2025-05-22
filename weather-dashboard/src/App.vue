<template>
  <div id="app">
    <header>
      <h1>Weather Dashboard</h1>
    </header>
    <main>
      <SearchBar class="card" />
      <CurrentWeather class="card" />
      <WeatherForecast class="card" />
      <WeatherChart class="card" />
    </main>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue';
import CurrentWeather from './components/CurrentWeather.vue';
import WeatherForecast from './components/WeatherForecast.vue';
import WeatherChart from './components/WeatherChart.vue';

export default {
  name: 'App',
  components: {
    SearchBar,
    CurrentWeather,
    WeatherForecast,
    WeatherChart,
  },
};
</script>

<style>
/* App.vue specific styles */
/* Global styles are in src/assets/main.css */

#app {
  /* text-align: center; /* Already in main.css via body, but can be specific if needed */
  /* color: #2c3e50; /* Global body color is #333, this is fine for override */
  /* padding: 0 20px; /* Global #app has padding: 20px */
}

header {
  background-color: #4CAF50; /* Specific to app header */
  color: white;
  padding: 20px 0; /* Increased padding for better look */
  width: 100%;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center; /* Ensure h1 is centered if it's not block */
}

header h1 {
  margin: 0;
  font-size: 2.2em; /* Slightly larger */
}

main {
  width: 100%;
  max-width: 800px; /* Max width for the content area */
  display: flex;
  flex-direction: column;
  gap: 25px; /* Space between card components */
}

/* The .card class from main.css will be applied to components */
/* Removing specific styles for .search-bar, .current-weather etc. as .card handles it */

/* Responsive adjustments */
@media (max-width: 768px) {
  header h1 {
    font-size: 1.8em; /* Adjusted for mobile */
  }
  main {
    gap: 15px; /* Reduced gap on smaller screens */
  }
  /* #app padding is already managed globally, 
     and main has max-width for responsiveness */
}

/* Remove .chart-placeholder as it's replaced by WeatherChart component */
</style>
