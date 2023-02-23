//Courier - unchecked
//packagin - checked
//minimum price - checked

import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CheckBox(props) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Checkbox
          disabled={props.disabled}
          style={styles.checkbox}
          value={props.isChecked}
          onValueChange={props.setChecked}
        />
        <Text style={styles.paragraph}>{props.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: 16,
    // marginVertical: 32,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
