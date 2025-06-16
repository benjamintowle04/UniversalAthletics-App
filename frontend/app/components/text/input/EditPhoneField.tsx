import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { PencilIcon, CheckIcon } from "lucide-react-native";
import "../../../../global.css";

interface EditPhoneFieldProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const EditPhoneField: React.FC<EditPhoneFieldProps> = ({ value, onChange, placeholder = "Enter phone..." }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(formatPhoneNumber(value));

  // Function to format phone number as (XXX) XXX-XXXX
  function formatPhoneNumber(input: string): string {
    const cleaned = input.replace(/\D/g, ""); // Remove non-numeric characters
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }

  const handleTextChange = (input: string) => {
    const formatted = formatPhoneNumber(input);
    setText(formatted);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange(text); // Update userData with the formatted phone number
  };

  return (
    <View className="flex-row items-center border border-gray-300 rounded-md px-1 py-0.5 w-2/3 h-7 bg-white">
      {isEditing ? (
        <TextInput
          value={text}
          onChangeText={handleTextChange}
          autoFocus
          className="flex-1 text-gray-800 text-xs"
          keyboardType="phone-pad"
          onBlur={handleSave}
          returnKeyType="done"
          onSubmitEditing={handleSave}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />
      ) : (
        <Text className="flex-1 text-gray-700 text-xs">
          {text || placeholder}
        </Text>
      )}

      <TouchableOpacity onPress={() => setIsEditing(!isEditing)} className="ml-1">
        {isEditing ? <CheckIcon size={14} color="green" /> : <PencilIcon size={14} color="gray" />}
      </TouchableOpacity>
    </View>
  );
};
