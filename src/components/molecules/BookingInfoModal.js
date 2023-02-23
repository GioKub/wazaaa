import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
// components
import { AuthContext } from "../../context/index.js";
import Button from "../atoms/Button.js";
import ModalContainer from "../atoms/ModalContainer.js";
import useRequest from "../../hooks/useRequest.js";
import handleBookRequest from "../../requests/hanldeBookRequest.js";
import HandleButton from "../atoms/HandleButton.js";

const BookingInfoModal = ({
  navigation,
  // get's called when you click "OK button"
  hideModal = () => {},
  parcel,
  modalVisible,
  // called inside .finally() inside release()
  refresh = () => {},
}) => {
  // console.log(parcel, "<-ParcelINfoModal");
  const [sendForBooking] = useRequest(handleBookRequest);
  const { auth } = useContext(AuthContext);
  const [status, setStatus] = useState();
  const [statusColor, setStatusColor] = useState();

  useEffect(() => {
    {
      parcel.finished === 1 &&
        parcel.courier_phone !== null &&
        (setStatus("Finished"), setStatusColor("#00FF00"));
    }
    {
      parcel.finished === 1 &&
        parcel.courier_phone === null &&
        (setStatus("Canceled"), setStatusColor("#FF0000"));
    }
    {
      parcel.finished === 0 &&
        parcel.courier_phone !== null &&
        (setStatus("Handeled"), setStatusColor("#87CEEB"));
    }
    {
      parcel.finished === 0 &&
        parcel.courier_phone === null &&
        (setStatus("Pending"), setStatusColor("#FFA500"));
    }
  }, []);

  const handleCancel = () => {
    sendForBooking({ booking_ids: [parcel.id], status: "cancel" })
      .then((data) => {
        if (data.data.message === "Nothing was updated!") {
          alert("Nothing was updated!");
        } else if (data.data.message === "success") {
          alert("Booking Status Updated Sucessfully");
          navigation.navigate("Home");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleFinished = () => {
    sendForBooking({ booking_ids: [parcel.id], status: "finish" })
      .then((data) => {
        if (data.data.message === "Nothing was updated!") {
          alert("Nothing was updated!");
        } else if (data.data.message === "success") {
          alert("Booking Status Updated Sucessfully");
          navigation.navigate("Home");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handlePending = () => {
    sendForBooking({ booking_ids: [parcel.id], status: "pending" })
      .then((data) => {
        if (data.data.message === "Nothing was updated!") {
          alert("Nothing was updated!");
        } else if (data.data.message === "success") {
          alert("Booking Status Updated Sucessfully");
          navigation.navigate("Home");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleHandle = () => {};

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

  return (
    <ModalContainer modalVisible={modalVisible}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* content inside this ScrollView is respnsible for showing all the parcel info rest are buttons*/}
        <ScrollView>
          <Divider style={{ marginVertical: 3 }} />
          <Addr />
          <Payment />
          <Status />
        </ScrollView>
        <View style={styles.buttonRow}>
          {auth.agent.hasOwnProperty("privileges") ? (
            <>
              <HandleButton navigation={navigation} parcelId={parcel.id} />
              <Button onPress={handleCancel}>Cancel</Button>
              <Button onPress={handlePending}>Pending</Button>
              <Button onPress={handleFinished}>Finished</Button>
            </>
          ) : null}
        </View>
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
export default BookingInfoModal;

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
});
