import React from "react";
import { View, Text } from "react-native";
import { RadioButton } from "react-native-paper";

const RadioButtonR = ({ name, original, value, onSelect, label, disabled }) => {
  const OnSelectWrapper = () => {
    onSelect(name, value);
  };
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      <RadioButton
        value={value}
        status={original === value ? "checked" : "unchecked"}
        onPress={OnSelectWrapper}
        name={name}
        disabled={disabled}
      />
      <Text>{label}</Text>
    </View>
  );
};

export default RadioButtonR;
