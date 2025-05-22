import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getCurrentWeather, getForecast } from '@/services/weatherService';

// Mock axios
vi.mock('axios');

const API_KEY = 'YOUR_API_KEY_HERE'; // Use the same placeholder or a test key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

describe('weatherService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather data successfully', async () => {
      const city = 'London';
      const mockResponseData = { name: 'London', main: { temp: 15 } };
      axios.get.mockResolvedValue({ data: mockResponseData });

      const result = await getCurrentWeather(city);

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error if fetching current weather fails', async () => {
      const city = 'London';
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getCurrentWeather(city)).rejects.toThrow(errorMessage);
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
    });
  });

  describe('getForecast', () => {
    it('should fetch forecast data successfully', async () => {
      const city = 'Paris';
      const mockResponseData = { list: [{ dt: 12345, main: { temp: 20 } }] };
      axios.get.mockResolvedValue({ data: mockResponseData });

      const result = await getForecast(city);

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error if fetching forecast fails', async () => {
      const city = 'Paris';
      const errorMessage = 'Request failed';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getForecast(city)).rejects.toThrow(errorMessage);
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
    });
  });
});
