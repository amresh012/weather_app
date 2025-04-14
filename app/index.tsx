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
import { useOfflineStatus } from '../hooks/useOfline';


export default function Index() {
  // const key = import.meta.env.VITE_APP_API_KEY;
  
  const isOffline = useOfflineStatus();

  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [day, setDay] = useState(3);
  const [city, setCity] = useState("London");

  // refresh data
  const onRefresh = () => {
    setRefreshing(true);
    fetchWeatherData(city).finally(() => setRefreshing(false));
  };

  const { current, location } = weatherData || {};

  const handleSearch = (term) => {
    setCity(term.name);
  };

  const key = "fbe5e3e74f1845419c652504251304";

  // fetch weather data
  const fetchWeatherData = async (city: string) => {
    try {
      console.log(city);
      const response =
        await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=yes`);
      const data = await response.json();
      // console.log(data);
      if (response.ok) {
        setWeatherData(data);
        setLoading(false);
      } else {
        setError(data.error.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // fetch forecast data
  const fetchForecastData = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=${day}&aqi=no&alerts=no`
      );
      const data = await response.json();
      // console.log(data?.forecast?.forecastday);
      if (response.ok) {
        setForecastData(data?.forecast?.forecastday);
        setLoading(false);
      } else {
        console.log(data.error);
        setError(data.error.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchWeatherData(city);
      await fetchForecastData(city);
    };
    fetchData();
  }, [city, day]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
      <Image
        blurRadius={70}
        className="absolute h-full w-full"
        source={{
          uri: "https://img.freepik.com/free-vector/background-monsoon-season_52683-115103.jpg?t=st=1744469325~exp=1744472925~hmac=0cf36c35ddcbd0ae3bd2018b2aecbce38f3125063fa840480d2b2eed5d270f12&w=1380",
        }}
      />
      <SafeAreaView className="flex-1 items-center">
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full h-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className=" w-full h-full p-2 flex-1 justify-start items-center gap-4">
            {!isOffline  && <SearchBar onSearch={handleSearch} />}
           {isOffline && <WeatherScreen/>}
            {/* current weather */}
            {loading ? (
              <ActivityIndicator size="large" color="white" />
            ) : error ? (
              <Text className="text-white">{error}</Text>
            ) : weatherData ? (
              <View className="w-full  bg-white/20 backdrop-blur-md rounded-lg p-2 flex-row justify-between overflow-clip">
                <View className="flex-1 gap-2 relative">
                  <View>
                    {/*  */}
                    <View className="flex-row items-center gap-2">
                      <Text className="text-white text-3xl font-bold">
                        {location?.name}
                      </Text>
                      <MapPinIcon color="white" size={20} />
                    </View>
                    <Text className="text-white text-xs font-semibold">
                      {moment(location?.localtime).format("lll")}
                    </Text>
                  </View>
                  {/*  */}
                  <View className=" items-center justify-center  gap-2">
                    <View>
                      <Image
                        source={{ uri: `https:${current?.condition?.icon}` }}
                        style={{ resizeMode: "cover", height: 50, width: 50 }}
                        alt={current?.condition?.icon}
                      />
                    </View>
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
            <WeatherStatsBar weatherData={weatherData} />

            {/* hourly forcast */}
            <View>
              <Text className="text-white text-2xl font-bold mb-2 uppercase ">
                Hourly
              </Text>
              <View className="w-full bg-white/20 backdrop-blur-md rounded-t-lg border-b border-white/50 p-2 flex-row justify-between overflow-clip">
                <Text className="text-white text-xs font-semibold w-full">
                  Next 12 hours
                </Text>
              </View>
              <View className=" bg-white/20 backdrop-blur-md rounded-b-lg p-2 flex-row justify-between overflow-clip">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="gap-2 w-full">
                    <View className=" items-center   flex-row  relative gap-2 p-2 ">
                      {forecastData?.length > 0 ? (
                        forecastData[0]?.hour?.map((item, index) => (
                          <View
                            key={index}
                            className="items-center bg-gray-700 rounded-lg p-2 "
                          >
                            <Text className="text-white font-semibold">
                              {moment(item.time).format("h A")}
                            </Text>
                            <Image
                              source={{ uri: `https:${item?.condition?.icon}` }}
                              style={{
                                resizeMode: "contain",
                                height: 70,
                                width: 70,
                              }}
                              alt={item?.condition?.icon}
                            />
                            <View className="flex-row items-center">
                              <Text className="text-white font-semibold">
                                {item?.temp_c || 0}°C
                              </Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <View className="">
                          <Text className="text-center text-white">
                            No forcast Data
                          </Text>
                          <Text className="text-center text-white">
                            swipe down to refresh
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* forcast */}
            <View className="w-full">
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

                {/* SCROLL VIEW WRAPS ENTIRE FORECAST LIST */}
                <ScrollView
                  // style={{ maxHeight: 300 }} // or adjust to fit your layout
                  showsVerticalScrollIndicator={false}
                  className="bg-white/20 backdrop-blur-md rounded-b-lg p-2"
                >
                     
                  {forecastData?.length > 0 ? (
                    forecastData.map((item, index) => (
                      <TouchableOpacity 
                      key={index}
                      className=" p-2"
                      >
                      <View
                        className="flex-row w-full  items-center justify-between py-2 border-b border-white/30"
                      >
                        <Text className="text-white font-semibold">
                          {moment(item?.date).format("l")} /{" "}
                          {moment(item?.date).format("ddd")}
                        </Text>
                        <Image
                          source={{ uri: `https:${item.day?.condition?.icon}` }}
                          style={{
                            resizeMode: "contain",
                            height: 50,
                            width: 50,
                          }}
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
                    <ActivityIndicator
                      size="large"
                      color="white"
                      className="mt-4"
                    />
                  ) : error ? (
                    <Text className="text-white mt-4">{error}</Text>
                  ) : (
                    <Text className="text-white mt-4">No forecast data</Text>
                  )}

                  {/* Button Below Forecast */}
                  <TouchableOpacity onPress={()=> setDay(14)} className="bg-gray-700 rounded-lg p-2 mt-4 flex-row items-center justify-center">
                    <Text className="text-white text-light">
                      14-day forecast
                    </Text>
                  </TouchableOpacity>
                  
                </ScrollView>
              </View>
            </View>

            {/* air quality */}
            <View className="w-full">
              <View className="w-full">
                <Text className="text-white text-2xl p-2 font-bold mb-2 uppercase">
                  Today's Air Quality-{location?.name}
                </Text>
              <View className="w-full bg-white/20 backdrop-blur-md rounded-t-lg border-b border-white/50 p-2 flex-row justify-between">
                <Text className="text-white text-xs font-semibold">
                  Air Pollutants
                </Text>
              </View>
              <View className="bg-white/20 backdrop-blur-md rounded-b-lg p-2">
                <View>
                <Text>CO(Carbon MonoOxide)</Text>
                <Text className="text-white text-xs font-semibold">
                  {weatherData?.current?.air_quality?.co} mug/m3
                </Text>
                </View>
                <View>
                <Text>NO2(Nitrogen dioxide)</Text>
                <Text className="text-white text-xs font-semibold">
                  {weatherData?.current?.air_quality?.no2} mug/m3
                </Text>
                </View>
                <View>
                <Text>O3 (Ozone)</Text>
                <Text className="text-white text-xs font-semibold">
                  {weatherData?.current?.air_quality?.o3} mug/m3
                </Text>
                </View>
                <View>
                <Text>SO2(Sulphur dioxide)</Text>
                <Text className="text-white text-xs font-semibold">
                  {weatherData?.current?.air_quality?.so2} mug/m3
                </Text>
                </View>
                <View>
                <Text>PM5(Particulate Matter less than 2.5 micron)</Text>

                <Text className="text-white text-xs font-semibold">
                  {weatherData?.current?.air_quality?.pm2_5} /mug/m3
                </Text>
                </View>
                <View>
                  <Text>PM10(Particulate Matter less than 10 micron)</Text>
                <Text className="text-white text-xs font-semibold">
                  {weatherData?.current?.air_quality?.pm10} mug/m3
                </Text>
                </View>
              </View>
            </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
