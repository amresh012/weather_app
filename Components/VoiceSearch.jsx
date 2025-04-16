import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import Voice from "react-native-voice/voice";
import { MicrophoneIcon } from "react-native-heroicons/solid";

export default function VoiceSearchButton({ onSearch }) {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = () => console.log("Speech started");
    Voice.onSpeechEnd = () => console.log("Speech ended");
    Voice.onSpeechResults = (result) => {
      const speech = result.value?.[0];
      console.log("Recognized speech:", speech);
      if (speech && onSearch) {
        onSearch({ name: speech });
      }
      setIsRecording(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      await Voice.start("en-US");
    } catch (e) {
      console.error("Voice error:", e);
      Alert.alert("Error", "Could not start voice recognition.");
      setIsRecording(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={startRecording}
      className="bg-blue-600 p-3 rounded-full flex-row items-center"
    >
      <MicrophoneIcon color="white" size={20} />
      <Text className="text-white ml-2">{isRecording ? "Listening..." : "Voice Search"}</Text>
    </TouchableOpacity>
  );
}
