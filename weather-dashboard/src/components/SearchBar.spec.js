import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SearchBar from '@/components/SearchBar.vue';
import { useWeatherStore } from '@/stores/weatherStore';

// Mock the store
// It's often better to mock the action directly if that's what's being tested.
// Here, we'll get the actual store but mock its actions.
vi.mock('@/stores/weatherStore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useWeatherStore: () => ({
      // Keep original state and getters if needed, or mock them too
      ...actual.useWeatherStore(), // Call original to get state structure
      fetchWeatherData: vi.fn(), // Mock the action
    }),
  };
});


describe('SearchBar.vue', () => {
  let pinia;

  beforeEach(() => {
    // Create a fresh Pinia instance and make it active for each test
    pinia = createPinia();
    setActivePinia(pinia);
    // Clear any previous mock calls
    // This is important if useWeatherStore() is called inside setup() of SearchBar
    // and we need a fresh mock for each test.
    if (vi.isMockFunction(useWeatherStore().fetchWeatherData)) {
        useWeatherStore().fetchWeatherData.mockClear();
    }
  });

  it('renders the input field and search button', () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Search');
  });

  it('calls fetchWeatherData with the city name when search button is clicked', async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [pinia],
      },
    });

    const weatherStore = useWeatherStore(); // Get the mocked store instance
    const city = 'London';

    // Simulate typing into the input
    await wrapper.find('input[type="text"]').setValue(city);

    // Simulate clicking the search button
    await wrapper.find('button').trigger('click');

    expect(weatherStore.fetchWeatherData).toHaveBeenCalledTimes(1);
    expect(weatherStore.fetchWeatherData).toHaveBeenCalledWith(city);
  });

  it('calls fetchWeatherData when Enter key is pressed in input', async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [pinia],
      },
    });
    const weatherStore = useWeatherStore();
    const city = 'Tokyo';

    await wrapper.find('input[type="text"]').setValue(city);
    await wrapper.find('input[type="text"]').trigger('keyup.enter');

    expect(weatherStore.fetchWeatherData).toHaveBeenCalledTimes(1);
    expect(weatherStore.fetchWeatherData).toHaveBeenCalledWith(city);
  });

  it('does not call fetchWeatherData if city name is empty or whitespace', async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [pinia],
      },
    });
    const weatherStore = useWeatherStore();

    // Test with empty input
    await wrapper.find('input[type="text"]').setValue('');
    await wrapper.find('button').trigger('click');
    expect(weatherStore.fetchWeatherData).not.toHaveBeenCalled();

    // Test with whitespace input
    await wrapper.find('input[type="text"]').setValue('   ');
    await wrapper.find('button').trigger('click');
    expect(weatherStore.fetchWeatherData).not.toHaveBeenCalled();
  });
});
