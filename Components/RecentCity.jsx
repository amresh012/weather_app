import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WeatherScreen() {
  const [recentCities, setRecentCities] = useState([]);

  useEffect(() => {
    loadRecentCities();
  }, []);

  const loadRecentCities = async () => {
    const stored = await AsyncStorage.getItem("recentCities");
    if (stored) {
      setRecentCities(JSON.parse(stored));
    }
  };

  const clearHistory = async () => {
    Alert.alert("Clear History", "Are you sure you want to delete all recent cities?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        onPress: async () => {
          await AsyncStorage.removeItem("recentCities");
          setRecentCities([]);
        },
        style: "destructive",
      },
    ]);
  };

  if (recentCities.length === 0) {
    return (
      <Text className="text-white text-center mt-10">
        No recent cities to show.
      </Text>
    );
  }

  return (
    <View className="w-full mt-2">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-lg font-bold">
          Recently Viewed Cities
        </Text>
        <TouchableOpacity onPress={clearHistory} className="bg-gray-700 rounded-lg p-2">
          <Text className="text-white text-xs underline">Clear History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {recentCities.map((item, index) => (
          <View
            key={index}
            className="bg-white/20 rounded-lg p-4 mb-2 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-white text-lg font-semibold">
                {item.name}
              </Text>
              <Text className="text-white text-xs">{item.localtime}</Text>
              <Text className="text-white">{item.condition.text}</Text>
            </View>
            <View className="items-center">
              <Image
                source={{ uri: `https:${item.condition.icon}` }}
                style={{ width: 40, height: 40 }}
              />
              <Text className="text-white text-xl font-bold">
                {item.temp_c}°C
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
