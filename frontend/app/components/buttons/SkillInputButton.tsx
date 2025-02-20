import React from "react";
import { View, Text, Switch } from "react-native";

interface SkillInputButtonProps {
  skill: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}

export const SkillInputButton: React.FC<SkillInputButtonProps> = ({
  skill,
  icon,
  checked,
  onChange,
}) => {
  return (
    <View className="mt-3 flex-row items-center justify-between w-50 mb-3 p-2 bg-gray-100 rounded-lg">
      {icon}
      <Text className="text-lg font-semibold mx-2">{skill}</Text>
      <Switch value={checked} onValueChange={onChange} />
    </View>
  );
};
