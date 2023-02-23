import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import ButtonWrapper from "../../../components/atoms/Button";
import BookCheckBox from "../../../components/atoms/BookCheckbox";
import EnterRecieverAddress from "./EnterRecieverAddress.js";
import EnterItemDetails from "./EnterItemDetails";

const BookItemComponent = ({
  index,
  removeItem,
  globalSettings,
  setGlobal,
}) => {
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const [recieverAddress, setRecieverAddress] = useState({});
  const [itemDetails] = useState({});

  const setInsuranceBoxHandler = (state) => {
    const newItems = [...globalSettings.items];
    newItems[index - 1].insurance = state;
    setGlobal({ ...globalSettings, items: newItems });
  };

  const setAddrBoxHandler = (state) => {
    const newItems = [...globalSettings.items];
    newItems[index - 1].to_be_delivered = state;
    setGlobal({ ...globalSettings, items: newItems });
  };

  return (
    <View style={{ borderWidth: 2, borderRadius: 15, marginBottom: 10 }}>
      <View
        style={{
          alignSelf: "center",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>Item # {index} </Text>
        {/* <Text style={{ fontWeight: "bold" }}>
          id * {globalSettings.items[index - 1].item.id}{" "}
        </Text> */}
      </View>
      <EnterRecieverAddress
        index={index}
        modalVisible={addressModalVisible}
        setModalVisible={setAddressModalVisible}
        recieverAddress={recieverAddress}
        setRecieverAddress={setRecieverAddress}
        globalSettings={globalSettings}
        setGlobal={setGlobal}
      />
      <EnterItemDetails
        index={index}
        modalVisible={detailsModalVisible}
        setModalVisible={setDetailsModalVisible}
        globalSettings={globalSettings}
        setGlobal={setGlobal}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 10,
        }}
      >
        <BookCheckBox
          isChecked={globalSettings.items[index - 1]?.insurance}
          setChecked={(state) => setInsuranceBoxHandler(state)}
        />

        <Text>Insurance</Text>
        <BookCheckBox
          isChecked={globalSettings.items[index - 1]?.to_be_delivered}
          setChecked={(state) => setAddrBoxHandler(state)}
        />

        <Text>Delivery To Address</Text>
      </View>
      <ButtonWrapper onPress={() => removeItem(index)}>Remove</ButtonWrapper>
      <View></View>
    </View>
  );
};

export default BookItemComponent;
