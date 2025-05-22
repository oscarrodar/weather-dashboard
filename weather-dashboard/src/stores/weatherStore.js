import { defineStore } from 'pinia';
import { getCurrentWeather, getForecast } from '../services/weatherService';

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentWeather: null,
    forecast: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchWeatherData(city) {
      this.loading = true;
      this.error = null;
      try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
          getCurrentWeather(city),
          getForecast(city),
        ]);
        this.currentWeather = currentWeatherResponse;
        this.forecast = forecastResponse;
      } catch (error) {
        this.error = 'Failed to fetch weather data. Please try again.';
        console.error('Error in fetchWeatherData:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
