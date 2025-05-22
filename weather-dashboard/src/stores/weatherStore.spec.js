import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useWeatherStore } from '@/stores/weatherStore';
import * as weatherService from '@/services/weatherService';

// Mock the weatherService
vi.mock('@/services/weatherService', () => ({
  getCurrentWeather: vi.fn(),
  getForecast: vi.fn(),
}));

describe('weatherStore', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance and make it active for each test
    setActivePinia(createPinia());
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('initial state is correct', () => {
    const store = useWeatherStore();
    expect(store.currentWeather).toBeNull();
    expect(store.forecast).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  describe('fetchWeatherData', () => {
    it('should fetch and set weather data successfully', async () => {
      const store = useWeatherStore();
      const city = 'Paris';
      const mockCurrentWeather = { name: 'Paris', main: { temp: 22 } };
      const mockForecast = { list: [{ dt: 123, main: { temp: 25 } }] };

      // Setup mock implementations for successful fetch
      weatherService.getCurrentWeather.mockResolvedValue(mockCurrentWeather);
      weatherService.getForecast.mockResolvedValue(mockForecast);

      // Call the action
      const fetchPromise = store.fetchWeatherData(city);

      // Check loading state immediately after calling (if not an immediate resolve)
      expect(store.loading).toBe(true);

      await fetchPromise; // Wait for the action to complete

      // Assertions
      expect(store.loading).toBe(false);
      expect(store.currentWeather).toEqual(mockCurrentWeather);
      expect(store.forecast).toEqual(mockForecast);
      expect(store.error).toBeNull();

      // Verify that service functions were called
      expect(weatherService.getCurrentWeather).toHaveBeenCalledTimes(1);
      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith(city);
      expect(weatherService.getForecast).toHaveBeenCalledTimes(1);
      expect(weatherService.getForecast).toHaveBeenCalledWith(city);
    });

    it('should handle errors when fetching current weather fails', async () => {
      const store = useWeatherStore();
      const city = 'InvalidCity';
      const errorMessage = 'Failed to fetch current weather';
      weatherService.getCurrentWeather.mockRejectedValue(new Error(errorMessage));
      // Ensure getForecast is also mocked, even if it's not expected to be called in this path
      // or if the Promise.all behavior is what's being tested.
      weatherService.getForecast.mockResolvedValue({ list: [] });


      const fetchPromise = store.fetchWeatherData(city);
      expect(store.loading).toBe(true);
      await fetchPromise;

      expect(store.loading).toBe(false);
      expect(store.error).toBe('Failed to fetch weather data. Please try again.');
      expect(store.currentWeather).toBeNull(); // Should remain null or previous state
      expect(store.forecast).toBeNull(); // Should remain null or previous state

      expect(weatherService.getCurrentWeather).toHaveBeenCalledTimes(1);
      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith(city);
      // Depending on Promise.all behavior, getForecast might also be called
      expect(weatherService.getForecast).toHaveBeenCalledTimes(1);
      expect(weatherService.getForecast).toHaveBeenCalledWith(city);
    });

    it('should handle errors when fetching forecast fails', async () => {
        const store = useWeatherStore();
        const city = 'AnotherCity';
        const mockCurrentWeather = { name: 'AnotherCity', main: { temp: 22 } };
        const errorMessage = 'Failed to fetch forecast';

        weatherService.getCurrentWeather.mockResolvedValue(mockCurrentWeather);
        weatherService.getForecast.mockRejectedValue(new Error(errorMessage));

        const fetchPromise = store.fetchWeatherData(city);
        expect(store.loading).toBe(true);
        await fetchPromise;

        expect(store.loading).toBe(false);
        expect(store.error).toBe('Failed to fetch weather data. Please try again.');
        // Current weather might be set if getForecast fails after getCurrentWeather succeeds,
        // but the overall operation is considered a failure.
        // The current implementation sets both to null upon any error in Promise.all.
        // If we want to keep partial data, the store logic would need to change.
        expect(store.currentWeather).toBeNull(); // Or mockCurrentWeather if partial success is stored
        expect(store.forecast).toBeNull();

        expect(weatherService.getCurrentWeather).toHaveBeenCalledTimes(1);
        expect(weatherService.getCurrentWeather).toHaveBeenCalledWith(city);
        expect(weatherService.getForecast).toHaveBeenCalledTimes(1);
        expect(weatherService.getForecast).toHaveBeenCalledWith(city);
    });
  });
});
