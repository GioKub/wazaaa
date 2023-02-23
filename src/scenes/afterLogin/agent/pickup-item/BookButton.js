import React, { useState, useEffect } from "react";
import { Image, View, Platform, StyleSheet, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
//  components
import Button from "../../../../components/atoms/Button.js";
import ModalContainer from "../../../../components/atoms/ModalContainer.js";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import InputWithError from "../../../../components/atoms/InputWithError.js";

export default function UploadInvoice({
  emailToBookWith,
  onChange,
  image: images = null,
  setImage: setImages = () => {},
  onDone = () => {},
  loading = false,
  navigation,
  modalVisible,
  setModalVisible,
}) {
  const [maxPictures, setMaxPictures] = useState(false);

  const showModal = () => setModalVisible(true);
  // gets called when you click 'Done' Button
  const hideModal = () => {
    onDone();
    setModalVisible(false);
  };

  const openCamera = () => {
    setModalVisible(false);
    navigation.navigate("BookScanner", {
      scanOnce: true,
      setModalVisible: setModalVisible,
      callback: (email) => {
        onChange(email);
      },
    });
  };

  return (
    <View style={style.container}>
      <ModalContainer modalVisible={modalVisible}>
        <View style={style.modalContainer}>
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 10,
            }}
          >
            Enter Email or Scan QR Code
          </Text>
          <InputWithError
            name={"email"}
            value={emailToBookWith}
            error={null}
            placeholder={null}
            onChangeText={(name, value) => {
              onChange(value);
            }}
          />
          <Button onPress={openCamera}>Open Camera</Button>
          <Button onPress={hideModal} mode="outlined">
            Done
          </Button>
          {/* maybe add error message here */}
        </View>
      </ModalContainer>
      <View style={style.col}>
        <Button onPress={showModal} loading={loading}>
          Book
        </Button>
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
    // height: 300,
    justifyContent: "center",
  },
});
