// features/weather/weatherSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchWeatherRequest,
  fetchWeatherSuccess,
  fetchWeatherFailure,
} from './weather';

function* fetchWeather(action) {
  try {
    const city = action.payload;
    const response = yield call(
      axios.get,
      `https://api.weatherapi.com/v1/current.json?key=fbe5e3e74f1845419c652504251304&q=${city}`
    );
    yield put(fetchWeatherSuccess(response.data));
  } catch (error) {
    yield put(fetchWeatherFailure(error.message));
  }
}

export function* watchWeatherSaga() {
  yield takeLatest(fetchWeatherRequest.type, fetchWeather);
}
