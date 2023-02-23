import React from "react";
import { Text, View } from "react-native";
import RadioButton from "../atoms/RadioButton.js";
import { useTheme } from "react-native-paper";

const RadioButtonGroup = ({
  label,
  values,
  checkLabels = [],
  name,
  onValueChange,
  val,
  disabled,
}) => {
  const { colors } = useTheme();
  const style = disabled ? { color: colors.disabled } : {};
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
      }}
    >
      <View style={{ flex: 2 }}>
        <Text style={style}>{label}</Text>
      </View>
      {values.map((value, i) => (
        <View style={{ flex: 2 }} key={value}>
          <RadioButton
            name={name}
            original={val}
            value={value}
            onSelect={onValueChange}
            label={checkLabels[i]}
            disabled={disabled}
          />
        </View>
      ))}
    </View>
  );
};

export default RadioButtonGroup;
