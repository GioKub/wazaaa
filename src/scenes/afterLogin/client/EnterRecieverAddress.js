import React, { useState, useEffect } from "react";
import { Image, View, Platform, StyleSheet, Text } from "react-native";
import ModalContainer from "../../../components/atoms/ModalContainer";
import Button from "../../../components/atoms/Button";
import InputWithError from "../../../components/atoms/InputWithError";
import useValidation from "../../../hooks/useValidation";
import EnterRecieverValidations from "./EnterReciverValidations";
import SelectDropdown from "../../../components/atoms/SelectDropdown";

function EnterRecieverAddress({
  index,
  loading = false,
  modalVisible,
  setModalVisible,
  isBooking,
  globalSettings,
  setGlobal,
}) {
  const [passesVal, setPassesVal] = useState(false);
  const [unTouched, setUntouched] = useState(true);
  const { validate, errors, addErrors } = useValidation(
    EnterRecieverValidations
  );
  const showModal = () => setModalVisible(true);
  // gets called when you click 'Done' Button
  const hideModal = () => {
    const newItems = globalSettings.items;
    validate(newItems[index - 1].address)
      .then((res) => {
        setPassesVal(true);
      })
      .catch((error) => {
        setPassesVal(false);
        // console.error(error, "<--this is validation sadsaderror");
      });
    setModalVisible(false);
    setUntouched(false);
  };

  const onChange = (name, value) => {
    const newItems = globalSettings.items;
    newItems[index - 1].address[name] = value;
    setGlobal({ ...globalSettings, items: newItems });
    validate(newItems[index - 1].address).catch((error) => {
      setPassesVal(false);
      // console.error(error, "<--this is validation sadsaderror");
    });
  };

  const countriesList = [
    { label: "United Kingdom", value: "UK" },
    { label: "Georgia", value: "GE" },
    { label: "Ireland", value: "IE" },
    { label: "Sweden", value: "SE" },
  ];

  console.log(globalSettings.country_code);
  return (
    <View style={style.container}>
      <ModalContainer modalVisible={modalVisible}>
        <View style={style.modalContainer}>
          <SelectDropdown
            list={countriesList}
            name="country_code"
            onSelect={onChange}
            // this needs to be fixed here
            selectedValue={
              globalSettings.items[index - 1]?.address.country_code
            }
            placeholder="Location"
          />
          <InputWithError
            name={"name"}
            value={globalSettings.items[index - 1]?.address?.["name"]}
            error={errors["name"]}
            placeholder={"Name"}
            onChangeText={onChange}
            key={"sender_" + "name"}
          />
          <InputWithError
            name={"phone"}
            value={globalSettings.items[index - 1]?.address?.["phone"]}
            error={errors["phone"]}
            placeholder={"Phone"}
            onChangeText={onChange}
            key={"sender_" + "phone"}
          />
          <InputWithError
            name={"email"}
            value={globalSettings.items[index - 1]?.address?.["email"]}
            error={errors["email"]}
            placeholder={"Mail"}
            onChangeText={onChange}
            key={"sender_" + "email"}
          />

          <InputWithError
            name={"line_1"}
            value={globalSettings.items[index - 1]?.address?.["line_1"]}
            error={errors["line_1"]}
            placeholder={"Address line 1"}
            onChangeText={onChange}
            key={"sender_" + "address_line_1"}
          />
          <InputWithError
            name={"line_2"}
            value={globalSettings.items[index - 1]?.address?.["line_2"]}
            placeholder={"Address line 2"}
            onChangeText={onChange}
            key={"sender_" + "address_line_2"}
          />
          <InputWithError
            name={"postal_code"}
            value={globalSettings.items[index - 1]?.address?.["postal_code"]}
            error={errors["postal_code"]}
            placeholder={"Postal code"}
            onChangeText={onChange}
            key={"sender_" + "postal_code"}
          />
          <Button onPress={hideModal} mode="outlined">
            ok
          </Button>
          {/* maybe add error message here */}
        </View>
      </ModalContainer>

      <View style={style.col}>
        <Button
          style={
            !unTouched
              ? passesVal
                ? { backgroundColor: "#21d952" }
                : { backgroundColor: "#f5053d" }
              : null
          }
          disabled={isBooking}
          onPress={showModal}
          loading={loading}
        >
          Enter Reciever Address
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
    // flex: 1,
    margin: 2,
  },
  valStyles: { color: "red", backgroundColor: "red" },

  col: {
    flex: 1,
    marginHorizontal: 10,
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

export default EnterRecieverAddress;
