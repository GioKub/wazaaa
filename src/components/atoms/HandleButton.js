import React, { useState, useEffect } from "react";
import { Image, View, Platform, StyleSheet, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
//  components
import Button from "./Button";
import ModalContainer from "./ModalContainer";
import InputWithError from "./InputWithError";
import useRequest from "../../hooks/useRequest";
import handleBookRequest from "../../requests/hanldeBookRequest";

export default function HandleButton({
  imageHash,
  setImageHash,
  emailToBookWith,
  parcelId,
  image: images = null,
  setImage: setImages = () => {},
  onDone = () => {},
  loading = false,
  navigation,
}) {
  const [sendForBooking, sending] = useRequest(handleBookRequest);
  const [modalVisible, setModalVisible] = useState(false);
  const [erroMsg, setErrorMsg] = useState("");
  const [phone, setPhone] = useState("");

  const showModal = () => setModalVisible(true);

  const hideModalDone = () => {
    if (phone.length !== 0) {
      sendForBooking({
        booking_ids: [parcelId],
        status: "handle",
        courier_phone: phone,
      })
        .then((data) => {
          // console.log(data);
          if (data.data.message === "Nothing was updated!") {
            alert("Nothing was updated!");
          } else if (data.data.message === "success") {
            navigation.navigate("Home");
            alert("Booking Status Updated Sucessfully");
            setErrorMsg("");
            setModalVisible(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setErrorMsg("Courier Phone Can't be empty");
    }
  };

  const hideModalCancel = () => {
    onDone();
    setModalVisible(false);
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
            Enter Courier Phone before proceeding
          </Text>
          <InputWithError
            name={"email"}
            value={emailToBookWith}
            error={null}
            placeholder={null}
            onChangeText={(name, value) => {
              setPhone(value);
            }}
          />
          <Text style={{ alignSelf: "center", color: "red" }}>
            {erroMsg.length !== 0 ? erroMsg : null}
          </Text>
          {/* <Button onPress={openCamera}>Open Camera</Button> */}
          <Button onPress={hideModalDone} mode="outlined">
            Done
          </Button>
          <Button onPress={hideModalCancel} mode="outlined">
            Cancel
          </Button>
          {/* maybe add error message here */}
        </View>
      </ModalContainer>
      <View>
        <Button onPress={showModal} loading={loading}>
          Handle
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
  },
  button: {
    flex: 1,
    margin: 2,
  },
  col: {},
  buttonRow: { flexDirection: "row" },
  modalContainer: {
    flexDirection: "column",
    flex: 1,
    flexGrow: 1,
    // height: 300,
    justifyContent: "center",
  },
});
