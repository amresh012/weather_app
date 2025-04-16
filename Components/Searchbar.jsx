import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import VoiceSearchButton from "@/Components/VoiceSearch"

export default function Searchbar({ onSearch }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const key = "fbe5e3e74f1845419c652504251304";

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/search.json?key=${key}&q=${search}`
      ); // replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (search.trim() === "") {
      return;
    }
    handleSearch();
    setResults([]);
  };

  const handleSelect = (value) => {
    setSearch(value);
    setResults([]); // <-- Clear suggestions
    setSuggestions([]);
    onSearch && onSearch(value);
  };
  return (
    <View className="">
      <View>
        <View className="flex-row items-center rounded-lg bg-white/20  justify-between w-full p-2 rounded-b-3xl">
          <TextInput
            className=" w-full flex-1 p-2 ml-4 text-white"
            placeholder="Enter city name"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="white"
            onSubmitEditing={handleSubmit}
          />
          <View className="p-2 bg-white/20 rounded-lg">
            <TouchableOpacity onPress={handleSubmit}>
              <MagnifyingGlassIcon color="white" size={25} />
            </TouchableOpacity>
          </View>
          <VoiceSearchButton  onSearch={handleSearch}/>
        </View>
        {loading && <ActivityIndicator size="large" color="#fff" />}
        {error && <Text>{error.message}</Text>}
        {results && (
          <View className="p-2  mt-2">
            {results.map((result, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(result)}
                className="flex  justify-between w-full h-20 bg-gray-100  rounded-b-3xl p-2"
              >
                <Text className="text-white">
                  {result.name} , {result && result.country}
                </Text>
                <Text className="text-xs text-white italic">
                  Region : {result?.region}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
