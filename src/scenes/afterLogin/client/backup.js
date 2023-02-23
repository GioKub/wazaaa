import { StyleSheet, View } from "react-native";
import ModalContainer from "../../../components/atoms/ModalContainer";
import InputWithError from "../../../components/atoms/InputWithError";
import Button from "../../../components/atoms/Button";
import { TextInput } from "react-native-paper";

function EnterItemDetails({
  onDone = () => {},
  loading = false,
  modalVisible,
  setModalVisible,
  isBooking,
}) {
  const showModal = () => setModalVisible(true);
  // gets called when you click 'Done' Button
  const hideModal = () => {
    onDone();
    setModalVisible(false);
  };

  return (
    <View style={style.container}>
      <ModalContainer modalVisible={modalVisible}>
        <View style={style.modalContainer}>
          <InputWithError
            name={"sender_weight"}
            //   value={sender[key]}
            //   error={errors[key]}
            placeholder={"ex. 15kg"}
            label={"Parcel(s) Weight"}
            //   onChangeText={onChange}
            //   key={"sender_" + key}
          />
          <InputWithError
            name={"sender_dimensions"}
            //   value={sender[key]}
            //   error={errors[key]}
            placeholder={"ex. 1ftx2ft"}
            label={"Parcel(s) Dimensions"}
            //   onChangeText={onChange}
            //   key={"sender_" + key}
          />
          <InputWithError
            style={{ marginBottom: 10 }}
            name={"sender_content"}
            //   value={sender[key]}
            //   error={errors[key]}
            placeholder={"ex. clothes, 300GBP"}
            label={"Parcel(s) Content and Parcel(s) Value"}
            //   onChangeText={onChange}
            //   key={"sender_" + key}
          />
          <TextInput
            // style={styles.input}
            // onChangeText={onChangeNumber}
            // value={number}

            style={{ borderWidth: 1, borderRadius: 10 }}
            multiline={true}
            numberOfLines={5}
            placeholder="Write as many recipients as many parcels you have"
          />
          <Button onPress={hideModal} mode="outlined">
            ok
          </Button>
          {/* maybe add error message here */}
        </View>
      </ModalContainer>
      <View style={style.col}>
        <Button disabled={isBooking} onPress={showModal} loading={loading}>
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
