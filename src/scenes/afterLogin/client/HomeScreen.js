import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import ButtonToggleGroup from "react-native-button-toggle-group";
import { AuthContext } from "../../../context";
// import AuthContext from "../../../../context/AuthContext.js";
import useRequest from "../../../hooks/useRequest.js";
import cargosRequest from "../../../requests/cargos.js";
import ParcelList from "../../../components/molecules/ParcelList.js";

import Button from "../../../components/atoms/Button";
import getClientAddress from "../../../requests/getClientAddress";

const Home = ({ navigation }) => {
  const [parcels, setParcels] = useState([]);
  const { auth, setAuth } = useContext(AuthContext);
  const obj2Arr = [];
  const [getCargos, gettingCargos] = useRequest(cargosRequest);
  const token = auth.access_token;
  const [value, setValue] = useState("Not Paid");
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [modalVisible, setModalVisible] = useState(false);
  const [getAddr] = useRequest(getClientAddress);
  const [defaultExits, setDefaultExists] = useState(true);

  useEffect(() => {
    getAddr().then((data) => {
      if (data.data.addresses.length === 0) {
        setDefaultExists(false);
      }
    });
  }, []);

  const setStatus = (val) => {
    switch (val) {
      case "All":
        setValue(val);
        setPaymentStatus("");
        break;
      case "Not Paid":
        setValue(val);
        setPaymentStatus("PENDING");
        break;
      case "Paid":
        setValue(val);
        setPaymentStatus("PAID");
        break;
    }
  };

  const getCargosHandler = () => {
    // GETcustomer/cargos?start=0?payment_status=["PAID","PENDING",""]
    //     getCargos({ status: paymentStatus }) original when there was filter on top
    getCargos({ status: "" })
      .then((data) => {
        //console.log(JSON.parse(data.request._response).cargos);
        //obj2Arr.push(JSON.parse(data.request._response).cargos);
        setParcels(JSON.parse(data.request._response).cargos);
      })
      .catch((e) => console.error(e, 999));
  };

  useEffect(() => {
    getCargosHandler();
  }, [paymentStatus]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <Button
          style={{ marginTop: 10 }}
          onPress={() => {
            if (!defaultExits) {
              alert(
                "You have no default addres, please go to settings screen to set it first"
              );
            } else {
              navigation.navigate("UKScreen");
            }
          }}
        >
          Book A Courier
        </Button>
      </View>
      {/* fix this, it is buggy on anyas phone and when there are no paid parcels it should say "you have no paid parcels" not "you have parcels" and so rest of the 2 buttons */}
      {/* <ButtonToggleGroup
        highlightBackgroundColor={"blue"}
        highlightTextColor={"white"}
        inactiveBackgroundColor={"transparent"}
        inactiveTextColor={"grey"}
        values={["All", "Not Paid", "Paid"]}
        value={value}
        onSelect={(val) => setStatus(val)}
        style={{ marginTop: "3%" }}
      /> */}

      <View style={s.container}>
        {/* {gettingCargos ? (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              // marginTop: "5%",
            }}
          >
            <ActivityIndicator animating={true} />
            <Text>Loading Please Wait...</Text>
          </View>
        ) : null} */}
        <ParcelList parcels={parcels} navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
  },
  booking: {},
});

export default Home;
