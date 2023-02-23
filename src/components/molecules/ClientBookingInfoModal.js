import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  Button as ReactNativeButton,
  View,
  Pressable,
} from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
// components
import { AuthContext } from "../../context/index.js";
import Button from "../atoms/Button.js";
import ModalContainer from "../atoms/ModalContainer.js";
import useRequest from "../../hooks/useRequest.js";
import handleBookRequest from "../../requests/hanldeBookRequest.js";
import HandleButton from "../atoms/HandleButton.js";
import cancelBookClient from "../../requests/cancelBookClient.js";

const ClientBookingInfoModal = ({
  navigation,
  // get's called when you click "OK button"
  hideModal = () => {},
  parcel,
  modalVisible,
  globalStatus,
  // called inside .finally() inside release()
  refresh = () => {},
}) => {
  // console.log(parcel, "<-ParcelINfoModal");
  const [sendForBooking] = useRequest(handleBookRequest);
  const { auth } = useContext(AuthContext);
  const [status, setStatus] = useState();
  const [statusColor, setStatusColor] = useState();
  const [cancelBook, canceling] = useRequest(cancelBookClient);

  useEffect(() => {
    {
      parcel.finished === 1 &&
        parcel.courier_phone !== null &&
        (setStatus("Finished"), setStatusColor("#00FF00"), console.log(1234));
    }
    {
      parcel.finished === 1 &&
        parcel.courier_phone === null &&
        (setStatus("Canceled"), setStatusColor("#FF0000"), console.log(1235));
    }
    {
      parcel.finished === 0 &&
        parcel.courier_phone !== null &&
        (setStatus("Handeled"), setStatusColor("#87CEEB"), console.log(1236));
    }
    {
      parcel.finished === 0 &&
        parcel.courier_phone === null &&
        (setStatus("Pending"), setStatusColor("#FFA500"), console.log(1237));
    }
  }, [parcel]);

  const paymentLabels = [
    "Preferable courier visit date",
    "Insurance",
    "Drop off",
    "Home collection",
    "Parcels count",
    "Parcels weight",
    "Parcels deminsion",
    "Parcels content",
    "Courier phone",
    "status",
  ];
  const paymentKeys = [
    "courier_visit_date",
    "insurance",
    "drop_off",
    "home_collection",
    "parcels_count",
    "parcels_weight",
    "parcels_deminsions",
    "parcels_content",
    "courier_phone",
  ];

  const Addr = () => {
    return (
      <>
        <View style={styles.row}>
          <Text style={styles.dd}>Collection address Line 1</Text>

          <Text style={styles.dt}>{parcel.ci_address_line_1}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.dd}>Collection address Line 2</Text>

          <Text style={styles.dt}>{parcel.ci_address_line_2}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.dd}>Collection address postal code</Text>

          <Text style={styles.dt}>{parcel.ci_address_postal_code}</Text>
        </View>
      </>
    );
  };
  const Status = () => {
    return (
      <View style={styles.row}>
        {/* this doesn't show status or if it shows it is wrong one */}
        {/* <Text style={styles.dd}>Status</Text>
        <Text style={styles.dt}>{status}</Text> */}
      </View>
    );
  };
  const Payment = () => {
    return paymentKeys.map((key, i) => (
      <View style={styles.row} key={key}>
        <Text style={styles.dd}>{paymentLabels[i]}</Text>
        <Text style={styles.dt}>
          {key === "insurance" ||
          key === "drop_off" ||
          key === "home_collection"
            ? parcel[key] === 0
              ? "No"
              : "Yes"
            : parcel[key]}
        </Text>
      </View>
    ));
  };

  const cancel = () => {
    console.log(status);
    if (status === "Handeled") {
      alert(
        `Courier is on the way to your address! please call him on this phone to cancel! phone: ${parcel.courier_phone}`
      );
    } else {
      cancelBook({ id: parcel.id })
        .then((data) => {
          navigation.navigate("customerNavigator"),
            alert("Booking canceled sucesfully");
        })
        .catch((e) => {
          alert("Some error Occured");
        });
    }
  };

  return (
    <ModalContainer modalVisible={modalVisible}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* content inside this ScrollView is respnsible for showing all the parcel info rest are buttons*/}
        <ScrollView>
          {/* <Divider /> */}
          <Addr />
          <Payment />
          <Status />
        </ScrollView>

        {/* {console.log(globalStatus === "Canceled", "asdasd")} */}

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.button}
            onPress={cancel}
            disabled={canceling}
          >
            <Text style={styles.text} onPress={cancel}>
              Cancel
            </Text>
          </Pressable>
        </View>
        {canceling ? <ActivityIndicator animating={true} /> : null}
        <View style={styles.buttonRow}>
          <Button
            style={{ flex: 1, marginHorizontal: 2 }}
            onPress={hideModal}
            mode="outlined"
          >
            Ok
          </Button>
        </View>
      </SafeAreaView>
    </ModalContainer>
  );
};
export default ClientBookingInfoModal;

const styles = StyleSheet.create({
  dd: {
    flex: 4.5,
    marginRight: 5,
    fontWeight: "bold",
  },
  dt: { flex: 5 },
  link: { flex: 5, color: "blue", textDecorationLine: "underline" },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    borderColor: "rgba(0,0,0,0.12)",
    borderBottomWidth: 0.5,
  },
  btnContainer: { flex: 1 },
  buttonRow: { flexDirection: "row" },
  informationCategoryName: {
    alignSelf: "center",
    color: "#d96b18",
    fontWeight: "bold",
  },
  button: {
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "red",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
