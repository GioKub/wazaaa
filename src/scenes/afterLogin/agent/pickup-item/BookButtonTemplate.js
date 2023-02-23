import React, { useState, useEffect } from "react";
import { Image, View, Platform, StyleSheet, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
//  components
import Button from "../../../../components/atoms/Button.js";
import ModalContainer from "../../../../components/atoms/ModalContainer.js";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import InputWithError from "../../../../components/atoms/InputWithError.js";

export default function BookButton({}) {
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => {
    setModalVisible(true);
  };
  return (
    <View style={style.container}>
      <ModalContainer modalVisible={modalVisible}>
        <View style={style.modalContainer}>
          <Text
            style={{
              flex: 1,
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            Enter Email or Scan QR Code
          </Text>
          <InputWithError
            name={"email"}
            value={null}
            error={null}
            placeholder={null}
            onChangeText={() => {}}
          />
          <Button style={style.button}>Open Camera</Button>
          <Button style={style.button} mode="outlined">
            Done
          </Button>
        </View>
      </ModalContainer>
      <View style={style.col} onPress={showModal}>
        <Button>Bookd</Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 5,
  },
  button: {
    flex: 1,
    margin: 2,
  },
  col: {
    flex: 1,
    margin: 2,
  },
  buttonRow: { flexDirection: "row" },
  modalContainer: {
    flexDirection: "column",
    flex: 1,
    flexGrow: 1,
    height: 200,
    justifyContent: "center",
  },
});
