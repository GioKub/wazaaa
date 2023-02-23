import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import ModalContainer from "../../../components/atoms/ModalContainer";
import InputWithError from "../../../components/atoms/InputWithError";
import Button from "../../../components/atoms/Button";
import { TextInput } from "react-native-paper";
import useValidation from "../../../hooks/useValidation";
import EnterDetailsVaildations from "./enterDetailsValidations";

function EnterItemDetails({
  onDone = () => {},
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
    EnterDetailsVaildations
  );
  const [detailsErr, setDetailsErr] = useState(false);
  const showModal = () => setModalVisible(true);
  // gets called when you click 'Done' Button
  const hideModal = () => {
    const newItems = globalSettings.items;
    onDone();
    validate(newItems[index - 1].item)
      .then((res) => {
        if (newItems[index - 1].item.details.length !== 0) {
          setDetailsErr(false);
          setPassesVal(true);
        } else {
          setDetailsErr(true);
          setPassesVal(false);
        }
      })
      .catch((error) => {
        setPassesVal(false);
        console.error(error, "<--this is validation sadsaderror");
      });
    setModalVisible(false);
    setUntouched(false);
  };

  const onChange = (name, value) => {
    // meaning that it was text are that was edited
    // i have to do this because textarea passes value as name and undefined as value

    if (name === "weight" || name === "dimensions" || name === "value") {
      const newItems = globalSettings.items;
      newItems[index - 1].item[name] = value;
      setGlobal({ ...globalSettings, items: newItems });
    } else {
      const newItems = globalSettings.items;
      newItems[index - 1].item["details"] = name;
      setGlobal({ ...globalSettings, items: newItems });
    }
    const newItems = globalSettings.items;
    validate(newItems[index - 1].item).catch((error) => {
      setPassesVal(false);
      console.error(error, "<--this is validation sadsaderror");
    });
    if (newItems[index - 1].item.details.length === 0) {
      setDetailsErr(true);
      setPassesVal(false);
    } else {
      setDetailsErr(false);
      setPassesVal(true);
    }
  };

  return (
    <View style={style.container}>
      <ModalContainer modalVisible={modalVisible}>
        <View style={style.modalContainer}>
          <InputWithError
            name={"weight"}
            value={globalSettings.items[index - 1]?.item?.["weight"]}
            error={errors["weight"]}
            placeholder={"ex. 15kg"}
            label={"Parcel(s) Weight"}
            onChangeText={onChange}
            //   key={"sender_" + key}
          />
          <InputWithError
            name={"dimensions"}
            value={globalSettings.items[index - 1]?.item?.["dimensions"]}
            error={errors["dimensions"]}
            placeholder={"ex. 1ftx2ft"}
            label={"Parcel(s) Dimensions"}
            onChangeText={onChange}
            //   key={"sender_" + key}
          />
          <InputWithError
            style={{ marginBottom: 10 }}
            name={"value"}
            value={globalSettings.items[index - 1]?.item?.["value"]}
            error={errors["value"]}
            placeholder={"ex. clothes, 300GBP"}
            label={"Parcel(s) Content and Parcel(s) Value"}
            onChangeText={onChange}
            //   key={"sender_" + key}
          />
          <TextInput
            name={"details"}
            onChangeText={onChange}
            style={{
              borderWidth: 1,
              borderRadius: 10,
            }}
            multiline={true}
            numberOfLines={5}
            defaultValue={2222}
            error={errors["details"]}
            // value={globalSettings.items[index - 1]?.item?.["details"]}
            value={globalSettings.items[index - 1]?.item?.["details"]}
            placeholder="Write as many recipients as many parcels you have"
          />
          {detailsErr ? (
            <Text style={{ color: "red" }}>This field can't be empty</Text>
          ) : null}
          <Button
            style={{ paddingTop: 20 }}
            onPress={hideModal}
            mode="outlined"
          >
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
          Enter Item Details
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

export default EnterItemDetails;
