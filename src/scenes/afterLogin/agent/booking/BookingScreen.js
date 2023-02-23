import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import useRequest from "../../../../hooks/useRequest.js";
import getBookingsRequest from "../../../../requests/getBookings.js";
import BookingsList from "../../../../components/molecules/BookingsList";

function BookingScreen({ navigation }) {
  const [getBookings] = useRequest(getBookingsRequest);
  const [bookings, setBookings] = useState();

  useEffect(() => {
    getBookings({ start: 0 })
      .then((data) => {
        /*
        "canceled_at": "2022-11-16 13:18:10",
        "ci_address_country_code": "UK",
        "ci_address_line_1": "ქუთაისი",
        "ci_address_line_2": "ნიუპორტი 3",
        "ci_address_postal_code": "2004",
        "ci_id": 117966,
        "ci_name": "gia neb",
        "ci_phone": "23423541351345",
        "collection_address": 117966,
        "collection_type": "",
        "courier_phone": null,
        "courier_visit_date": "2022-11-24 00:00:00",
        "created_at": "2022-11-16 13:16:41",
        "customer_id": "23b78e0f-50af-4329-b484-4dc9333b7b94",
        "drop_off": 0,
        "email": "gnebieridzs@unisens.ge",
        "finished": 1,
        "finished_at": null,
        "handled_at": null,
        "handled_staff_id": null,
        "home_collection": 0,
        "id": 5,
        "insurance": 0,
        "parcels_content": "",
        "parcels_count": 3,
        "parcels_deminsions": "",
        "parcels_weight": "",
        "receiver_address": null,
        "source_country": "UK",
        */
        console.log(data, "sadsad");
        setBookings(data.data.bookings);
        // console.log(data.data.payments);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <View style={s.container}>
      <BookingsList bookings={bookings} navigation={navigation} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
  },
});

export default BookingScreen;
