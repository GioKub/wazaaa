import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  VirtualizedList,
  StyleSheet,
} from "react-native";

// components
import ClientBookingItem from "../atoms/ClientBookingItem";
import ClientBookingInfoModal from "./ClientBookingInfoModal";

// this transforms the shape of parcel it recieved from <ListItem>
// to then pass it to <ParcelInfoModal>
const ClientBookingsList = ({ bookings = [], navigation, refresh }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [booking, setBooking] = useState({});
  const [bookStatus, setBookStatus] = useState(undefined);

  // console.log(globalStatus, "<--first");

  useEffect(() => {
    if (bookings.length !== 0) {
      {
        bookings[0].finished === 0 && setBookStatus("Active");
      }
      {
        bookings[0].finished === 0 &&
          bookings[0].courier_phone !== null &&
          setBookStatus("Handeled");
      }
      {
        bookings[0].finished === 1 && setBookStatus("Finished");
      }
    }
  }, [bookings]);

  console.log(bookStatus, "<---staut");

  // console.log(bookStatus, "<---boooks");

  const hideModal = () => setModalVisible(false);

  const renderItem = ({ item, index }) => {
    // <ListItem> recievs parcel from 'data' property inside <VirtualizedList/>
    // and then passes that parcel to showModal()
    return (
      <ClientBookingItem
        booking={item}
        onClick={() => {
          console.log(item);
          setBooking(item);
          setModalVisible(true);
        }}
        i={index}
        key={index}
      />
    );
  };

  const Empty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>You have no Active Bookings</Text>
      <Text style={styles.emptyText}>Try Placing One</Text>
    </View>
  );
  return (
    <>
      {/* this is responsible for showing full parcel info when you click on parcel
      shorthand */}
      <ClientBookingInfoModal
        navigation={navigation}
        // calls what you pass here when you click "OK" button
        hideModal={hideModal}
        parcel={booking}
        modalVisible={modalVisible}

        // refresh={refresh}
      />
      {/* this is resposnible for showing parcel shorthands */}
      <SafeAreaView style={styles.container}>
        {bookings.length !== 0 &&
        (bookStatus === "Active" || bookStatus === "Handeled") ? (
          <ClientBookingItem
            booking={bookings[0]}
            onClick={() => {
              // console.log(item);
              setBooking(bookings[0]);
              setModalVisible(true);
            }}
            i={0}
            key={0}
          />
        ) : (
          <Empty />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  empty: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ClientBookingsList;
