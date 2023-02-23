import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
//  components
import Button from "../../../components/atoms/Button";
import ModalContainer from "../../../components/atoms/ModalContainer";
// import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import InputWithError from "../../../components/atoms/InputWithError";

import CalendarPicker from "react-native-calendar-picker";

export default function PickSourceCountryButton({
  emailToBookWith,
  onChange,
  image: images = null,
  setImage: setImages = () => {},
  onDone = () => {},
  loading = false,
  navigation,
  modalVisible,
  setModalVisible,
  setDateChoosen,
}) {
  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    onDone();
    setModalVisible(false);
    // console.log(modalVisible);
  };

  // gets called when you click 'Done' Button
  const navigateToUK = () => {
    hideModal();
    navigation.navigate("UKScreen");
  };
  const navigateToIE = () => {
    hideModal();
    navigation.navigate("IEScreen");
  };

  return (
    <View style={style.container}>
      <ModalContainer modalVisible={modalVisible}>
        <View
          style={{
            style: "flex",

            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Choose Source Country
          </Text>

          <View style={{ display: "flex", flexDirection: "row" }}>
            <TouchableWithoutFeedback onPress={navigateToUK}>
              <Text style={{ fontSize: 100 }}>🇬🇧</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={navigateToIE}>
              <Text style={{ fontSize: 100 }}>🇮🇪</Text>
            </TouchableWithoutFeedback>
          </View>
          <Button onPress={hideModal}>cancel</Button>
        </View>
      </ModalContainer>

      <View style={style.col}>
        <Button onPress={showModal} loading={loading}>
          Book Courier
        </Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    // flex: 1,
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
