import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';

const iconMap = {
  wind: require('../assets/images/nature-removebg-preview.png'),
  feelsLike: require('../assets/images/tool-removebg-preview.png'),
  humidity: require('../assets/images/medical-removebg-preview.png'),
  uv: require('../assets/images/summer-removebg-preview.png'),
  direction: require('../assets/images/nature-removebg-preview.png'),
  cloud: require('../assets/images/cloud-removebg-preview.png'),
  visibility: require('../assets/images/circle-removebg-preview.png'),
  precipitation: require('../assets/images/medical-removebg-preview.png'),
};

const WeatherStatsBar = ({ weatherData }) => {
  return (
    <View className="w-full bg-white/20 backdrop-blur-md rounded-lg flex-row justify-between overflow-clip">
      <View className="gap-2 relative w-full">
        <Text className="text-white text-xl font-semibold border-b border-white/50 p-2">
          Weather Condition
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row items-center flex gap-4 w-full p-2">
            <StatBlock icon={iconMap.wind} label="Wind" value={`${weatherData?.current?.wind_mph || 0} mph`} />
            <StatBlock icon={iconMap.feelsLike} label="Feels Like" value={`${weatherData?.current?.feelslike_c || 0}°`} />
            <StatBlock icon={iconMap.humidity} label="Humidity" value={`${weatherData?.current?.humidity || 0} %`} />
            <StatBlock icon={iconMap.uv} label="UV" value={weatherData?.current?.uv || 0} />
            <StatBlock icon={iconMap.direction} label="Direction" value={weatherData?.current?.wind_dir || 'N/A'} />
            <StatBlock icon={iconMap.cloud} label="Cloud" value={weatherData?.current?.cloud || 0} />
            <StatBlock icon={iconMap.visibility} label="Visibility" value={`${weatherData?.current?.vis_km || 0} km`} />
            <StatBlock icon={iconMap.precipitation} label="Precipitation" value={`${weatherData?.current?.precip_mm || 0} mm`} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const StatBlock = ({ icon, label, value }) => (
  <View className="items-center">
    <Image source={icon} style={{resizeMode:"contain", height:30, width:30}} />
    <Text className="text-white text-xs font-semibold">{label}</Text>
    <Text className="text-white text-xs font-semibold">{value}</Text>
  </View>
);

export default WeatherStatsBar;
