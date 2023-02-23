import React, { useState, useEffect } from "react";
import { Image, View, Platform, StyleSheet, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
//  components
import Button from "../../../../components/atoms/Button.js";
import ModalContainer from "../../../../components/atoms/ModalContainer.js";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import InputWithError from "../../../../components/atoms/InputWithError.js";

export default function BookDetailsButton({
  emailToBookWith,
  onChange,
  image: images = null,
  setImage: setImages = () => {},
  onDone = () => {},
  loading = false,
  navigation,
  modalVisible,
  setModalVisible,
  itemsInfo,
  isBooking,
  bookCountry,
}) {
  // console.log(itemsInfo);
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
          <View style={style.row}>
            <Text style={style.dd}>Weight</Text>

            <Text style={style.dt}>{itemsInfo?.weight + " KG"}</Text>
          </View>
          <View style={style.row}>
            <Text style={style.dd}>Dimensions</Text>

            <Text style={style.dt}>{itemsInfo?.dimensions}</Text>
          </View>
          <View style={style.row}>
            <Text style={style.dd}>Value</Text>

            <Text style={style.dt}>{itemsInfo?.value}</Text>
          </View>

          <View style={style.row}>
            <Text style={style.dd}>Content</Text>

            <Text style={style.dt}>{itemsInfo?.details}</Text>
          </View>
          <View style={style.row}>
            <Text style={style.dd}>Insurance</Text>

            <Text style={style.dt}>
              {itemsInfo?.insurance === 1 ? "Yes" : "No"}
            </Text>
          </View>
          <View style={style.row}>
            <Text style={style.dd}>Delivery to address </Text>

            <Text style={style.dt}>
              {itemsInfo?.to_be_delivered === 1 ? "Yes" : "No"}
            </Text>
          </View>
          <Button onPress={hideModal} mode="outlined">
            ok
          </Button>
          {/* maybe add error message here */}
        </View>
      </ModalContainer>
      <View style={style.col}>
        {/* {console.log(bookCountry !== "IE", "disabled")} */}
        {/* {console.log(bookCountry, "<--bookcountry")} */}
        <Button
          disabled={isBooking || bookCountry !== "IE"}
          onPress={showModal}
          loading={loading}
        >
          Book Details
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
  dd: {
    flex: 4.5,
    marginRight: 5,
    fontWeight: "bold",
  },
  dt: { flex: 5 },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    borderColor: "rgba(0,0,0,0.12)",
    borderBottomWidth: 0.5,
  },
});
