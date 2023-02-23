import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
// import colors from "../config/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NewListingButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Ionicons name="qr-code" color={"black"} size={40} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "black",
    // borderRadius: 90,
    borderWidth: 4,
    bottom: 10,
    height: 60,
    justifyContent: "center",
    width: 70,
  },
});
