// features/weather/weatherSlice.js
import { createSlice } from '@reduxjs/toolkit';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    fetchWeatherRequest: (state) => {
      state.loading = true;
    },
    fetchWeatherSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchWeatherFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchWeatherRequest,
  fetchWeatherSuccess,
  fetchWeatherFailure,
} = weatherSlice.actions;

export default weatherSlice.reducer;
