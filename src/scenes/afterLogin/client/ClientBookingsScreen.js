import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import useRequest from "../../../hooks/useRequest";
import clientBookingsRequest from "../../../requests/clientBookingsRequest";
import ClientBookingsList from "../../../components/molecules/ClientBookinsList";

function ClientBookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [getBookings, stillGettingBookings] = useRequest(clientBookingsRequest);

  useEffect(() => {
    getBookings({ start: 0 })
      .then((data) => {
        if (data.data.bookings.length > 0) {
          let firstBook = data.data.bookings[0];
          setBookings(data.data.bookings);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={s.container}>
      <ClientBookingsList bookings={bookings} navigation={navigation} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
    paddingTop: "20%",
  },
});
export default ClientBookingsScreen;
