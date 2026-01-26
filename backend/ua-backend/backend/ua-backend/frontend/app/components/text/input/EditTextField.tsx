import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { PencilIcon, CheckIcon } from "lucide-react-native";
import "../../../../global.css"

interface EditTextFieldProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const EditTextField: React.FC<EditTextFieldProps> = ({ value, onChange, placeholder = "Enter text..." }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    onChange(text);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  return (
    <View className="flex-row items-center border border-gray-300 rounded-md px-1 py-0.5 h-7 w-2/3 bg-white">
      {isEditing ? (
        <TextInput
          value={text}
          onChangeText={setText}
          autoFocus
          className="flex-1 text-gray-800 text-xs"
          onBlur={handleSave}
          returnKeyType="done"
          onSubmitEditing={handleSave}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />
      ) : (
        <TouchableOpacity 
          className="flex-1" 
          onPress={handleStartEditing}
          activeOpacity={0.7}
        >
          <Text className="flex-1 text-gray-700 text-xs">
            {text || placeholder}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => setIsEditing(!isEditing)} className="ml-1">
        {isEditing ? (
          <CheckIcon size={14} color="green" />
        ) : (
          <PencilIcon size={14} color="gray" />
        )}
      </TouchableOpacity>
    </View>
  );
};
