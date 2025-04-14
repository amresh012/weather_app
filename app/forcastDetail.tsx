import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import moment from "moment";

interface ForecastDay {
  date: string;
  day: any;
  astro: any;
  hour: any[];
}

export default function ForecastDetail() {
  const { forecast } = useLocalSearchParams();
  const router = useRouter();

  // 🔐 Safe JSON parsing
  if (!forecast) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-center">No forecast data provided.</Text>
      </View>
    );
  }

  let data: ForecastDay;
  try {
    data = JSON.parse(forecast as string);
  } catch (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-center">Failed to parse forecast data.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-black">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-white">← Back</Text>
      </TouchableOpacity>

      <Text className="text-white text-2xl font-bold mb-4">
        Forecast for {moment(data.date).format("dddd, MMMM D, YYYY")}
      </Text>

      <View className="bg-white/10 p-4 rounded-lg mb-4">
        <Text className="text-white text-lg">{data.day.condition.text}</Text>
        <Image
          source={{ uri: `https:${data.day.condition.icon}` }}
          style={{ width: 80, height: 80 }}
        />
        <Text className="text-white">Max: {data.day.maxtemp_c}°C</Text>
        <Text className="text-white">Min: {data.day.mintemp_c}°C</Text>
        <Text className="text-white">Avg: {data.day.avgtemp_c}°C</Text>
        <Text className="text-white">Humidity: {data.day.avghumidity}%</Text>
        <Text className="text-white">Chance of Rain: {data.day.daily_chance_of_rain}%</Text>
        <Text className="text-white">UV Index: {data.day.uv}</Text>
      </View>

      <View className="bg-white/10 p-4 rounded-lg mb-4">
        <Text className="text-white font-semibold mb-2">🌅 Astro</Text>
        <Text className="text-white">Sunrise: {data.astro.sunrise}</Text>
        <Text className="text-white">Sunset: {data.astro.sunset}</Text>
        <Text className="text-white">Moonrise: {data.astro.moonrise}</Text>
        <Text className="text-white">Moonset: {data.astro.moonset}</Text>
      </View>

      <View className="bg-white/10 p-4 rounded-lg">
        <Text className="text-white font-semibold mb-2">🕒 Hourly</Text>
        {data.hour.map((h, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 4,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Text className="text-white">{moment(h.time).format("hh:mm A")}</Text>
            <Text className="text-white">{h.temp_c}°C</Text>
            <Image source={{ uri: `https:${h.condition.icon}` }} style={{ width: 30, height: 30 }} />
            <Text className="text-white">{h.condition.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
