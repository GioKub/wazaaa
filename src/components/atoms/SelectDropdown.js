import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

const SelectDropdown = ({
  // list and sourceRoutes in the upper SourceRoutesDropdown.js are the same
  list = [],
  disabled,
  name,
  onSelect,
  selectedValue,
  label,
  placeholder,
  error,
}) => {
  const { colors, roundness } = useTheme();
  const [pickerStyle, setPickerStyle] = useState({ height: 46 });
  const [viewStyle, setViewStyle] = useState(style.input);

  useEffect(() => {
    if (selectedValue && selectedValue !== "") {
      if (disabled) {
        setViewStyle(style.disabled);
        setPickerStyle({ ...pickerStyle, color: colors.disabled });
      } else {
        setPickerStyle({ ...pickerStyle, color: colors.primary });
      }
    } else {
      setPickerStyle({ ...pickerStyle, color: colors.placeholder });
      // console.log(selectedValue, "<---selected value");
    }
  }, [selectedValue]);

  const onSelectWrapper = (itemValue, itemIndex) => {
    // console.log(name, itemValue);
    onSelect(name, itemValue);
  };
  return (
    <>
      {label || placeholder ? (
        <Text style={disabled ? style.disabledLabel : style.label}>
          {label ? label : placeholder}
        </Text>
      ) : null}
      <View style={viewStyle}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onSelectWrapper}
          style={pickerStyle}
          enabled={!disabled}
        >
          {/* commenting this changes nothing */}
          {/* {selectedValue && selectedValue !== "" ? null : (
            <Picker.Item label={placeholder} value="" />
          )} */}
          {list.map((item, i) => (
            <Picker.Item
              label={item.label}
              value={item.value}
              key={item.value}
            />
          ))}
        </Picker>
      </View>
      {error ? <Text style={style.errorText}>{error}</Text> : null}
    </>
  );
};

const style = StyleSheet.create({
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "grey",
    fontSize: 16,
    borderRadius: 10,
    zIndex: 1,
    color: "#000000",
    backgroundColor: "#f5f5f5",
    marginBottom: 3,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginLeft: 9,
  },
  label: {
    fontSize: 12,
    color: "#616161",
    marginLeft: 9,
  },
  disabled: {
    minHeight: 46,
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 10,
    zIndex: 1,
    color: "rgba(0,0,0,0.26)",
    borderColor: "rgba(0,0,0,0.26)",
    backgroundColor: "#f5f5f5",
    marginBottom: 3,
  },
  disabledLabel: {
    fontSize: 12,
    color: "rgba(0,0,0,0.26)",
    marginLeft: 9,
  },
});

export default SelectDropdown;
