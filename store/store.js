// store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import weatherReducer from '../Slice/weather';
import { watchWeatherSaga } from '../Slice/weatherSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(watchWeatherSaga);

export default store;
