import React, { useEffect, useState, useContext } from "react";
import Button from "../../../components/atoms/Button";
import { View, StyleSheet } from "react-native";
import Sign from "../agent/signature/Signature";

const PrivilegeScreen = ({ navigation }) => {
  return (
    <Button
      style={{ flex: 4, marginHorizontal: 2 }}
      onPress={() => {
        return (
          <Sign
            onOK={() => {
              console.log("done");
            }}
          />
        );
      }}
    >
      Release
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 5,
    borderColor: "red",
  },
});

export default PrivilegeScreen;
