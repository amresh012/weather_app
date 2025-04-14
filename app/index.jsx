import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MapPinIcon } from "react-native-heroicons/outline";
import moment from "moment";
import SearchBar from "@/Components/Searchbar";
import WeatherStatsBar from "@/Components/WeatherStatsBar";
import WeatherScreen from "@/Components/RecentCity";
import { useOfflineStatus } from "../hooks/useOfline";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, fetchForecast } from "@/Slice/weather";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isOffline = useOfflineStatus();

  const [refreshing, setRefreshing] = useState(false);
  const [day, setDay] = useState(3);
  const [city, setCity] = useState("London");

  const { loading, weather, forcast, error } = useSelector((state) => state.weather);
  const { current, location } = weather || {};
  console.log(weather, forcast)
  const handleSearch = (term) => {
    if (!term?.name) return;
    setCity(term.name);
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchForecast({ city, days: day })).finally(() =>
      setRefreshing(false)
    );
  };

  useEffect(() => {
    dispatch(fetchWeather(city));
    dispatch(fetchForecast({ city, days: day }));
  }, [city, day]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
      <Image
        blurRadius={70}
        className="absolute h-full w-full"
        source={require("../assets/images/45203923_9011110.jpg")}
      />
      <SafeAreaView className="flex-1 items-center">
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full h-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="w-full h-full p-2 flex-1 justify-start items-center gap-4">
            {!isOffline && <SearchBar onSearch={handleSearch} />}
            {isOffline && <WeatherScreen />}

            {/* current weather */}
            {loading ? (
              <ActivityIndicator size="large" color="white" />
            ) : error ? (
              <Text className="text-white">{error}</Text>
            ) : weather ? (
              <View className="w-full bg-white/20 backdrop-blur-md rounded-lg p-2 flex-row justify-between overflow-clip">
                <View className="flex-1 gap-2 relative">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-white text-3xl font-bold">
                      {location?.name}
                    </Text>
                    <MapPinIcon color="white" size={20} />
                  </View>
                  <Text className="text-white text-xs font-semibold">
                    {moment(location?.localtime).format("lll")}
                  </Text>

                  <View className="items-center justify-center gap-2">
                    <Image
                      source={{ uri: `https:${current?.condition?.icon}` }}
                      style={{ resizeMode: "cover", height: 50, width: 50 }}
                    />
                    <Text className="text-white">
                      {current?.condition?.text}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-white text-4xl font-semibold">
                        {current?.temp_c}°C
                      </Text>
                      <Text className="text-white text-3xl font-light">/</Text>
                      <Text className="text-white text-xl font-extralight">
                        {current?.temp_f}°F
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {/* weather condition */}
            <WeatherStatsBar weatherData={weather} />

            {/* hourly forecast */}
            <View>
              <Text className="text-white text-2xl font-bold mb-2 uppercase">
                Hourly
              </Text>
              <View className="w-full bg-white/20 backdrop-blur-md rounded-t-lg border-b border-white/50 p-2 flex-row justify-between overflow-clip">
                <Text className="text-white text-xs font-semibold w-full">
                  Next 12 hours
                </Text>
              </View>
              <View className="bg-white/20 backdrop-blur-md rounded-b-lg p-2 flex-row justify-between overflow-clip">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="gap-2 w-full">
                    <View className="items-center flex-row gap-2 p-2">
                      {forcast?.length > 0 ? (
                        forcast[0]?.hour?.map((item, index) => (
                          <View
                            key={index}
                            className="items-center bg-gray-700 rounded-lg p-2"
                          >
                            <Text className="text-white font-semibold">
                              {moment(item.time).format("h A")}
                            </Text>
                            <Image
                              source={{ uri: `https:${item?.condition?.icon}` }}
                              style={{ resizeMode: "contain", height: 70, width: 70 }}
                            />
                            <Text className="text-white font-semibold">
                              {item?.temp_c || 0}°C
                            </Text>
                          </View>
                        ))
                      ) : (
                        <View>
                          <Text className="text-center text-white">
                            No forecast data
                          </Text>
                          <Text className="text-center text-white">
                            Swipe down to refresh
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* forecast days */}
            <View className="w-full">
              <Text className="text-white text-2xl font-bold mb-2 uppercase">
                Forecast
              </Text>

              <View className="w-full bg-white/20 backdrop-blur-md rounded-t-lg border-b border-white/50 p-2 flex-row justify-between">
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    onPress={() => day > 1 && setDay(day - 1)}
                    className="bg-gray-600 px-2 py-1 rounded"
                  >
                    <Text className="text-white text-lg font-bold">−</Text>
                  </TouchableOpacity>
                  <Text className="text-white text-xs font-semibold">
                    Next {day} day{day > 1 ? "s" : ""}
                  </Text>
                  <TouchableOpacity
                    onPress={() => day < 14 && setDay(day + 1)}
                    className="bg-gray-600 px-2 py-1 rounded"
                  >
                    <Text className="text-white text-lg font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                className="bg-white/20 backdrop-blur-md rounded-b-lg p-2"
              >
                {forcast?.length > 0 ? (
                  forcast.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      className="p-2"
                      onPress={() =>
                        router.push({
                          pathname: "/forcastDetail",
                          params: { forecast: JSON.stringify(item) },
                        })
                      }
                    >
                      <View className="flex-row w-full items-center justify-between py-2 border-b border-white/30">
                        <Text className="text-white font-semibold">
                          {moment(item?.date).format("l")} /{" "}
                          {moment(item?.date).format("ddd")}
                        </Text>
                        <Image
                          source={{ uri: `https:${item.day?.condition?.icon}` }}
                          style={{ resizeMode: "contain", height: 50, width: 50 }}
                        />
                        <View className="flex-row items-center">
                          <Text className="text-white font-semibold">
                            {item?.day?.maxtemp_c || 0}°
                          </Text>
                          <Text className="text-white font-light"> / </Text>
                          <Text className="text-white font-semibold">
                            {item?.day?.mintemp_c || 0}°
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : loading ? (
                  <ActivityIndicator size="large" color="white" className="mt-4" />
                ) : error ? (
                  <Text className="text-white mt-4">{error}</Text>
                ) : (
                  <Text className="text-white mt-4">No forecast data</Text>
                )}

                <TouchableOpacity
                  onPress={() => setDay(14)}
                  className="bg-gray-700 rounded-lg p-2 mt-4 flex-row items-center justify-center"
                >
                  <Text className="text-white text-light">14-day forecast</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* air quality */}
            <View className="w-full">
              <Text className="text-white text-2xl p-2 font-bold mb-2 uppercase">
                Today's Air Quality - {location?.name}
              </Text>
              <View className="w-full bg-white/20 backdrop-blur-md rounded-t-lg border-b border-white/50 p-2 flex-row justify-between">
                <Text className="text-white text-xs font-semibold">Air Pollutants</Text>
              </View>
              <View className="bg-white/20 backdrop-blur-md rounded-b-lg p-2">
                {["co", "no2", "o3", "so2", "pm2_5", "pm10"].map((key) => (
                  <View key={key}>
                    <Text>{key.toUpperCase()}</Text>
                    <Text className="text-white text-xs font-semibold">
                      {weather?.current?.air_quality?.[key]} µg/m³
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

