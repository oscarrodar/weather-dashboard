<template>
  <div class="weather-chart-container">
    <Line v-if="chartDataReady" :data="chartData" :options="chartOptions" />
    <div v-else-if="weatherStore.loading">Loading chart data...</div>
    <div v-else-if="weatherStore.error && !weatherStore.forecast">Chart data unavailable due to previous error.</div>
    <div v-else>No forecast data available to display chart.</div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import { useWeatherStore } from '../stores/weatherStore';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default {
  name: 'WeatherChart',
  components: {
    Line,
  },
  setup() {
    const weatherStore = useWeatherStore();

    const chartData = computed(() => {
      if (!weatherStore.forecast || !weatherStore.forecast.list) {
        return { labels: [], datasets: [] };
      }
      // Using all available forecast points for a more detailed trend
      const labels = weatherStore.forecast.list.map(item => {
        const date = new Date(item.dt_txt);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
      });
      const temperatures = weatherStore.forecast.list.map(item => item.main.temp);

      return {
        labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            backgroundColor: 'rgba(248, 121, 121, 0.2)', // Adjusted for area fill
            borderColor: '#f87979',
            data: temperatures,
            fill: true, // Fill the area under the line
            tension: 0.1 // Smooths the line
          },
        ],
      };
    });

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: 'Temperature Trend (5-day forecast)',
          font: {
            size: 16
          }
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date & Time'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Temperature (°C)'
          },
          beginAtZero: false // Adjust based on typical temperature ranges
        }
      }
    }));

    const chartDataReady = computed(() => {
      return weatherStore.forecast && weatherStore.forecast.list && weatherStore.forecast.list.length > 0 && !weatherStore.loading;
    });

    return {
      weatherStore, // expose store for v-if conditions in template
      chartData,
      chartOptions,
      chartDataReady,
    };
  },
};
</script>

<style scoped>
.weather-chart-container {
  /* Padding, border, shadow, background are handled by the .card class via App.vue */
  min-height: 350px; /* Ensure container has a decent height for the chart or placeholder text */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* Take full width of its card container */
}

/* vue-chartjs generates a canvas inside a div, this targets the canvas if it's a direct child */
/* It's often better to let chart.js handle canvas sizing via options like responsive:true and maintainAspectRatio:false */
/* However, if direct styling is needed: */
.weather-chart-container > canvas,
.weather-chart-container > div > canvas { /* If chart.js wraps canvas in a div */
    max-width: 100%;
    max-height: 350px; /* Ensure chart does not exceed this height within the card */
}

/* Styling for placeholder text when chart is loading or data is unavailable */
.weather-chart-container > div[v-else-if],
.weather-chart-container > div[v-else] {
  color: #777;
  font-style: italic;
}
</style>
