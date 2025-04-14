// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'RECENT_CITIES';

export const saveCity = async (city) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    let cities = existing ? JSON.parse(existing) : [];

    // Avoid duplicates
    cities = [city, ...cities.filter((c) => c !== city)].slice(0, 5); // Keep latest 5

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch (e) {
    console.log('Error saving city:', e);
  }
};

export const loadCities = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log('Error loading cities:', e);
    return [];
  }
};
