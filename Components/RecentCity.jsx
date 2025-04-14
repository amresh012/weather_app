// WeatherScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherRequest } from "../Slice/weather";
import { saveCity, loadCities } from "../utils/storage";
import debounce from "lodash.debounce";
import Searchbar from "./Searchbar";

const WeatherScreen = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.weather);
  const [city, setCity] = useState("");
  const [recentCities, setRecentCities] = useState([]);

  useEffect(() => {
    (async () => {
      const cities = await loadCities();
      const uniqueCities = [...new Set(cities)]; // Remove duplicates
      setRecentCities(uniqueCities);
    })();
  }, []);

  const debouncedFetch = useCallback(
    debounce(async (cityName) => {
      dispatch(fetchWeatherRequest(cityName));
      await saveCity(cityName);
      const cities = await loadCities();
      setRecentCities(cities);
    }, 1000),
    []
  );

  const handleSearch = (term) => {
    setCity(term.name);
    debouncedFetch(term.name);
  };
//   const handleCityChange = (text) => {
//     debouncedFetch(text);
//   };

  const handleRecentCityTap = (cityName) => {
    setCity(cityName);
    dispatch(fetchWeatherRequest(cityName));
  };

    const handleClearHistory = async () => {
    await saveCity([]); // Clear the saved cities
    setRecentCities([]); // Clear the recent cities state
    }
  return (
    <View className="w-full bg-white/10 p-4 rounded-lg">
   <Searchbar onSearch={handleSearch}/>

      <View className="w-full ">
        <View className="flex-row items-center rounded-lg bg-white/20  justify-between w-full p-2 rounded-b-3xl">
          <Text className="mb-2 text-white font-bold text-xl">
            Recent Cities
          </Text>
          <TouchableOpacity className="bg-gray-700 p-2 rounded-lg" onPress={handleClearHistory}>
            <Text className="text-white text-xs">Clear History</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-2 mt-4 items-center">
          {recentCities.map((c, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleRecentCityTap(c)}
              className="bg-gray-700 p-2 rounded-lg"
            >
              <Text className="text-white text-xs">{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && <ActivityIndicator />}
      {error && <Text>Error: {error}</Text>}

      {data && recentCities.length > 0 && (
        <View className="bg-gray-700 p-2 rounded-lg mt-4 justify-center items-center">
          <Image
            source={{ uri: `https:${data?.current?.condition?.icon}` }}
            style={{ resizeMode: "cover", height: 50, width: 50 }}
            alt={data?.current?.condition?.icon}
          />
          <Text className="text-white font-bold text-2xl">
            {data.location.name}
          </Text>
          <Text className="text-white">Temp: {data.current.temp_c}°C</Text>
          <Text className="text-white">
            Condition: {data.current.condition.text}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold" },
  subheading: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  recentCity: { paddingVertical: 4, color: "blue" },
});

export default WeatherScreen;
