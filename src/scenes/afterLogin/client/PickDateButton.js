import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
//  components
import Button from "../../../components/atoms/Button";
import ModalContainer from "../../../components/atoms/ModalContainer";
// import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import InputWithError from "../../../components/atoms/InputWithError";

import CalendarPicker from "react-native-calendar-picker";

export default function PickDateButton({
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
  // gets called when you click 'Done' Button
  const hideModal = () => {
    onDone();
    setModalVisible(false);
    // console.log(modalVisible);
  };
  return (
    <View style={style.container}>
      <ModalContainer modalVisible={modalVisible}>
        <CalendarPicker
          onDateChange={(date) => {
            setDateChoosen(date);
            hideModal();
          }}
        />
      </ModalContainer>
      <View style={style.col}>
        <Button onPress={showModal} loading={loading}>
          Choose Courier Arrival Date
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
    marginTop: 5,
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
