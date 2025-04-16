import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const key = "fbe5e3e74f1845419c652504251304";

// Async thunk to fetch current weather
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city) => {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=yes`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    return data;
  }
);

// Async thunk to fetch forecast
export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ city, days }) => {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=${days}&aqi=no&alerts=no`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    const data = await response.json();
    return data.forecast.forecastday;
  }
);

// Slice
const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    loading: false,
    weather: null,
    forcast: null,
    error: null,
  },
  reducers: {}, // we don't need fetchWeatherRequest etc. if using createAsyncThunk
  extraReducers: (builder) => {
    builder
      // fetchWeather
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.weather = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchForecast
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forcast = action.payload;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
