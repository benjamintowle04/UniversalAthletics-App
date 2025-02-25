import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { PencilIcon, CheckIcon } from "lucide-react-native";
import "../../../../global.css"

interface EditEmailFieldProps {
  value: string;
  onChange: (text: string) => void;
}

export const EditEmailField: React.FC<EditEmailFieldProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    onChange(text);
  };

  return (
    <View className="flex-row items-center border border-gray-300 rounded-md px-1 py-0.5 w-2/3 h-7 bg-white">
      {isEditing ? (
        <TextInput
          value={text}
          onChangeText={setText}
          autoFocus
          className="flex-1 text-gray-800 text-xs"
          keyboardType="email-address"
          onBlur={handleSave}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
      ) : (
        <Text className="flex-1 text-gray-700 text-xs">{text}</Text>
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
