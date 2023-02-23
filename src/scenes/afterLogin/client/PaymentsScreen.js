import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import useRequest from "../../../hooks/useRequest";
import clientPayments from "../../../requests/clientPayments";
import PaymentsList from "../../../components/molecules/PaymentsList";

function PaymentsScreen({ navigation }) {
  const [getPayments] = useRequest(clientPayments);
  const [payments, setPayments] = useState();

  useEffect(() => {
    getPayments({ start: 0 })
      .then((data) => {
        setPayments(data.data.payments);
        // console.log(data.data.payments);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <View style={s.container}>
      <PaymentsList payments={payments} navigation={navigation} />
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

export default PaymentsScreen;
